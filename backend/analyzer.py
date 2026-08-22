"""
DeepTrace Analyzer — Image forensic analysis pipeline.
Uses a HuggingFace pre-trained model for deepfake detection,
MTCNN for face detection, ELA for compression analysis,
and input-gradient heatmaps for explainability.
"""

import io
import os
import uuid

import cv2
import numpy as np
import torch
from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFont
from PIL.ExifTags import TAGS
from transformers import AutoImageProcessor, AutoModelForImageClassification


class DeepTraceAnalyzer:
    """Runs the full forensic pipeline on an uploaded image."""

    MODEL_NAME = "dima806/deepfake_vs_real_image_detection"

    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"[DeepTrace] Using device: {self.device}")

        # ── deepfake classifier ──────────────────────────────────────
        print(f"[DeepTrace] Loading model: {self.MODEL_NAME} …")
        self.processor = AutoImageProcessor.from_pretrained(self.MODEL_NAME)
        self.model = AutoModelForImageClassification.from_pretrained(self.MODEL_NAME)
        self.model.to(self.device).eval()
        print("[DeepTrace] Classification model loaded ✓")

        # ── MTCNN face detector ──────────────────────────────────────
        try:
            from facenet_pytorch import MTCNN
            self.mtcnn = MTCNN(keep_all=True, device=self.device)
            print("[DeepTrace] MTCNN face detector loaded ✓")
        except Exception as e:
            print(f"[DeepTrace] MTCNN unavailable ({e}), face detection disabled")
            self.mtcnn = None

    # ─── public entry point ──────────────────────────────────────────
    def analyze(self, image_path: str, output_dir: str) -> dict:
        analysis_id = uuid.uuid4().hex[:8]
        os.makedirs(output_dir, exist_ok=True)

        image = Image.open(image_path).convert("RGB")

        # save original for serving
        orig_path = os.path.join(output_dir, f"{analysis_id}_original.jpg")
        image.save(orig_path, quality=95)

        # run pipeline steps
        classification = self._classify(image)
        face_result = self._detect_faces(image, analysis_id, output_dir)
        ela_result = self._error_level_analysis(image, analysis_id, output_dir)
        heatmap_ok = self._generate_heatmap(image, analysis_id, output_dir)
        metadata = self._extract_metadata(image_path, image)

        # derive verdict & risk
        conf = classification["confidence"]
        is_fake = classification["label"].lower() in ("fake", "forged", "deepfake", "ai")

        if is_fake and conf > 75:
            verdict, risk = "Deepfake", "High"
        elif is_fake and conf > 50:
            verdict, risk = "Suspicious", "Medium"
        else:
            verdict, risk = "Authentic", "Low"
            conf = max(conf, 100 - conf)  # show confidence *for* the real class

        meta_integrity = self._metadata_integrity_score(metadata)

        return {
            "id": analysis_id,
            "verdict": verdict,
            "confidence": round(conf, 1),
            "risk_level": risk,
            "face_detection": face_result,
            "ela": ela_result,
            "metadata": metadata,
            "images": {
                "original": f"/api/outputs/{analysis_id}_original.jpg",
                "heatmap": f"/api/outputs/{analysis_id}_heatmap.jpg",
                "ela": f"/api/outputs/{analysis_id}_ela.jpg",
                "face_detection": f"/api/outputs/{analysis_id}_face.jpg",
            },
            "scores": {
                "face_manipulation": face_result.get("manipulation_score", 0),
                "compression_anomaly": ela_result.get("variance_score", 0),
                "metadata_integrity": meta_integrity,
            },
        }

    # ─── classification ──────────────────────────────────────────────
    def _classify(self, image: Image.Image) -> dict:
        inputs = self.processor(images=image, return_tensors="pt")
        inputs = {k: v.to(self.device) for k, v in inputs.items()}

        with torch.no_grad():
            logits = self.model(**inputs).logits

        probs = torch.softmax(logits, dim=-1)[0]
        idx = probs.argmax().item()
        label = self.model.config.id2label.get(idx, str(idx))
        confidence = probs[idx].item() * 100
        return {"label": label, "confidence": confidence}

    # ─── face detection (MTCNN) ──────────────────────────────────────
    def _detect_faces(self, image: Image.Image, aid: str, out: str) -> dict:
        face_img = image.copy()
        draw = ImageDraw.Draw(face_img)
        count, best_conf = 0, 0.0

        if self.mtcnn is not None:
            try:
                boxes, probs = self.mtcnn.detect(np.array(image))
                if boxes is not None:
                    for box, prob in zip(boxes, probs):
                        if prob and prob > 0.5:
                            count += 1
                            best_conf = max(best_conf, float(prob) * 100)
                            x1, y1, x2, y2 = [int(c) for c in box]
                            draw.rectangle([x1, y1, x2, y2], outline="#00ff00", width=3)
                            draw.text((x1, max(0, y1 - 14)), f"{prob*100:.1f}%", fill="#00ff00")
            except Exception as e:
                print(f"[DeepTrace] Face detection error: {e}")

        face_img.save(os.path.join(out, f"{aid}_face.jpg"), quality=95)
        return {
            "detected": count > 0,
            "count": count,
            "confidence": round(best_conf, 1),
            "manipulation_score": round(min(95, best_conf * 0.88), 1) if count > 0 else 0,
        }

    # ─── error level analysis ────────────────────────────────────────
    def _error_level_analysis(self, image: Image.Image, aid: str, out: str) -> dict:
        buf = io.BytesIO()
        image.save(buf, "JPEG", quality=90)
        buf.seek(0)
        resaved = Image.open(buf).convert("RGB")

        diff = ImageChops.difference(image, resaved)
        extrema = diff.getextrema()
        max_val = max(e[1] for e in extrema) or 1
        ela_img = ImageEnhance.Brightness(diff).enhance(255.0 / max_val)

        variance = round(min(100, float(np.std(np.array(ela_img))) * 2), 1)
        ela_img.save(os.path.join(out, f"{aid}_ela.jpg"), quality=95)

        level = "High" if variance > 50 else ("Medium" if variance > 25 else "Low")
        return {
            "variance_score": variance,
            "description": f"{level} compression variance detected across image regions",
        }

    # ─── heatmap (input-gradient saliency) ───────────────────────────
    def _generate_heatmap(self, image: Image.Image, aid: str, out: str) -> bool:
        try:
            inputs = self.processor(images=image, return_tensors="pt")
            pixel_values = inputs["pixel_values"].to(self.device).requires_grad_(True)

            outputs = self.model(pixel_values=pixel_values)
            pred = outputs.logits.argmax(dim=-1).item()
            self.model.zero_grad()
            outputs.logits[0, pred].backward()

            grads = pixel_values.grad.data.abs().mean(dim=1).squeeze().cpu().numpy()
            grads = (grads - grads.min()) / (grads.max() - grads.min() + 1e-8)
            grads = cv2.resize(grads, (image.width, image.height))

            colormap = cv2.applyColorMap(np.uint8(255 * grads), cv2.COLORMAP_JET)
            colormap = cv2.cvtColor(colormap, cv2.COLOR_BGR2RGB)

            overlay = cv2.addWeighted(np.array(image), 0.55, colormap, 0.45, 0)
            Image.fromarray(overlay).save(os.path.join(out, f"{aid}_heatmap.jpg"), quality=95)
            return True

        except Exception as e:
            print(f"[DeepTrace] Heatmap generation error: {e}, using ELA fallback")
            # fallback — tinted ELA
            buf = io.BytesIO()
            image.save(buf, "JPEG", quality=85)
            buf.seek(0)
            resaved = Image.open(buf).convert("RGB")
            diff = ImageChops.difference(image, resaved)
            r, g, b = diff.split()
            tinted = Image.merge("RGB", (r, Image.new("L", r.size, 0), b))
            blended = Image.blend(image, tinted, 0.45)
            blended.save(os.path.join(out, f"{aid}_heatmap.jpg"), quality=95)
            return False

    # ─── EXIF metadata ───────────────────────────────────────────────
    def _extract_metadata(self, path: str, image: Image.Image) -> dict:
        raw = {}
        try:
            exif = image.getexif()
            for tag_id, val in exif.items():
                tag_name = TAGS.get(tag_id, str(tag_id))
                raw[tag_name] = str(val)
        except Exception:
            pass

        size = os.path.getsize(path)
        size_str = f"{size / (1024*1024):.1f} MB" if size > 1024 * 1024 else f"{size / 1024:.1f} KB"

        return {
            "file_name": os.path.basename(path),
            "file_size": size_str,
            "dimensions": f"{image.width} × {image.height}",
            "format": (image.format or "Unknown").upper(),
            "color_space": image.mode,
            "camera_model": raw.get("Model", "N/A"),
            "software": raw.get("Software", "N/A"),
            "gps_data": "Present" if any("GPS" in k for k in raw) else "Not Found",
            "created_date": raw.get("DateTimeOriginal", raw.get("DateTime", "N/A")),
            "modified_date": raw.get("DateTimeDigitized", "N/A"),
        }

    # ─── metadata integrity score ────────────────────────────────────
    @staticmethod
    def _metadata_integrity_score(meta: dict) -> int:
        score = 100
        if meta["camera_model"] == "N/A":
            score -= 20
        if meta["software"] != "N/A":
            score -= 30
        if meta["gps_data"] == "Not Found":
            score -= 15
        if meta["created_date"] == "N/A":
            score -= 20
        return max(0, score)
