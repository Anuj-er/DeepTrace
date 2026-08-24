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
from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageOps
from PIL.ExifTags import TAGS
from transformers import AutoImageProcessor, AutoModelForImageClassification


class DeepTraceAnalyzer:
    """Runs the full forensic pipeline on an uploaded image."""

    MODEL_NAME = os.environ.get("DEEPTRACE_MODEL", "dima806/deepfake_vs_real_image_detection")

    def __init__(self):
        if torch.cuda.is_available():
            self.device = torch.device('cuda')
        elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
            self.device = torch.device('mps')
        else:
            self.device = torch.device('cpu')
        print(f"[DeepTrace] Using device: {self.device}")

        # ── deepfake classifier ──────────────────────────────────────
        model_path = self.MODEL_NAME
        base_dir = os.path.dirname(os.path.abspath(__file__))
        resolved_path = os.path.normpath(os.path.join(base_dir, model_path))
        if os.path.exists(resolved_path):
            model_path = resolved_path

        print(f"[DeepTrace] Loading model: {model_path} …")
        self.processor = AutoImageProcessor.from_pretrained(model_path)
        self.model = AutoModelForImageClassification.from_pretrained(model_path)
        self.model.to(self.device).eval()
        print("[DeepTrace] Classification model loaded ✓")

        # ── MTCNN face detector ──────────────────────────────────────
        try:
            from facenet_pytorch import MTCNN
            self.mtcnn = MTCNN(keep_all=True, min_face_size=20, thresholds=[0.5, 0.6, 0.6], device='cpu')
            print("[DeepTrace] MTCNN face detector loaded ✓")
        except Exception as e:
            print(f"[DeepTrace] MTCNN unavailable ({e}), face detection disabled")
            self.mtcnn = None

    # ─── public entry point ──────────────────────────────────────────
    def analyze(self, image_path: str, output_dir: str) -> dict:
        analysis_id = uuid.uuid4().hex[:8]
        os.makedirs(output_dir, exist_ok=True)

        raw_image = Image.open(image_path)
        image = ImageOps.exif_transpose(raw_image.copy()).convert("RGB")

        # save original for serving
        orig_path = os.path.join(output_dir, f"{analysis_id}_original.jpg")
        image.save(orig_path, quality=95)

        # 1. classify full image
        full_classification = self._classify(image)

        # 2. detect faces & extract high-res face crops
        face_result, face_crops = self._detect_faces(image, analysis_id, output_dir)
        face_fake_probs = []
        for crop in face_crops[:3]:
            try:
                crop_clf = self._classify(crop)
                face_fake_probs.append(crop_clf["fake_prob"])
            except Exception as e:
                print(f"[DeepTrace] Face crop classification error: {e}")

        if face_fake_probs:
            face_fake_prob = max(face_fake_probs)
            face_result["manipulation_score"] = round(face_fake_prob, 1)
            # When faces are present, facial forensic analysis carries 65% weight, overall scene 35%
            base_ai_fake = (face_fake_prob * 0.65) + (full_classification["fake_prob"] * 0.35)
        else:
            face_result["manipulation_score"] = 0
            base_ai_fake = full_classification["fake_prob"]

        # 3. error level analysis (compression anomalies)
        ela_result = self._error_level_analysis(image, analysis_id, output_dir)
        ela_var = ela_result.get("variance_score", 0)
        # Uniform compression (low variance) reduces fake probability, discontinuous variance increases it
        ela_adjustment = max(-8.0, min(8.0, (ela_var - 30.0) * 0.25))

        # 4. EXIF & metadata integrity
        metadata = self._extract_metadata(image_path, raw_image)
        meta_integrity = self._metadata_integrity_score(metadata)

        has_camera = metadata.get("camera_model") != "N/A"
        has_created_date = metadata.get("created_date") != "N/A"
        software = metadata.get("software", "").lower()
        has_ai_tag = any(kw in software for kw in ["diffusion", "midjourney", "dall-e", "comfy", "synthetic", "ai", "generator"])

        meta_adjustment = 0.0
        if has_ai_tag:
            meta_adjustment += 20.0
        elif has_camera and has_created_date:
            # Authentic camera hardware EXIF significantly suppresses false positives
            meta_adjustment -= 15.0
        elif has_camera:
            meta_adjustment -= 8.0

        # 5. multi-signal ensemble fusion
        final_fake_score = base_ai_fake + ela_adjustment + meta_adjustment
        final_fake_score = max(0.0, min(100.0, final_fake_score))

        # 6. calibrated verdict & confidence mapping
        if final_fake_score >= 70.0:
            verdict = "Deepfake"
            risk = "High" if final_fake_score >= 85.0 else "Medium"
            conf = final_fake_score
        elif final_fake_score >= 50.0:
            verdict = "Suspicious"
            risk = "Medium"
            conf = final_fake_score
        else:
            verdict = "Authentic"
            risk = "Low"
            conf = 100.0 - final_fake_score

        # 7. generate Grad-CAM / saliency heatmap
        heatmap_ok = self._generate_heatmap(image, analysis_id, output_dir)

        # 8. generate clear forensic explanation findings
        findings = []
        if face_result["detected"]:
            if face_result["manipulation_score"] > 70:
                findings.append(f"Facial analysis detected high-probability synthetic artifacts and texture anomalies across {face_result['count']} detected face(s).")
            elif face_result["manipulation_score"] > 40:
                findings.append(f"Facial analysis detected subtle inconsistencies in facial boundary or skin textures.")
            else:
                findings.append(f"Facial features appear consistent with natural biological textures across {face_result['count']} detected face(s).")
        else:
            if full_classification["fake_prob"] > 60:
                findings.append("Vision Transformer detected global generative AI synthesis patterns across image background/textures.")
            else:
                findings.append("Global image structures and textures exhibit natural optical characteristics.")

        if ela_var > 50:
            findings.append(f"Error Level Analysis (ELA) found high compression variance ({ela_var}%), indicating potential localized digital splicing or resaving.")
        elif ela_var > 30:
            findings.append(f"Error Level Analysis shows moderate compression variance ({ela_var}%), consistent with standard multi-pass compression.")
        else:
            findings.append(f"Error Level Analysis shows uniform compression levels ({ela_var}%), indicating no localized cut-and-paste manipulation.")

        if has_ai_tag:
            findings.append(f"Metadata inspection identified AI synthesis generator signatures in file headers ({metadata.get('software')}).")
        elif has_camera and has_created_date:
            findings.append(f"Authentic camera hardware profile identified ({metadata.get('camera_model')}) with valid timestamp records.")
        elif has_camera:
            findings.append(f"Camera hardware profile detected ({metadata.get('camera_model')}), though capture timestamp metadata is absent.")
        else:
            findings.append("Image lacks camera hardware EXIF tags (Make, Model, Lens), commonly seen in web downloads, screenshots, or AI-generated media.")

        return {
            "id": analysis_id,
            "verdict": verdict,
            "confidence": round(conf, 1),
            "risk_level": risk,
            "findings": findings,
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
                "face_manipulation": round(face_result.get("manipulation_score", 0), 1),
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
        fake_idx = self.model.config.label2id.get("Fake", 1)
        real_idx = self.model.config.label2id.get("Real", 0)

        fake_prob = float(probs[fake_idx].item() * 100.0)
        real_prob = float(probs[real_idx].item() * 100.0)

        idx = probs.argmax().item()
        label = self.model.config.id2label.get(idx, str(idx))
        confidence = float(probs[idx].item() * 100.0)
        return {
            "label": label,
            "confidence": confidence,
            "fake_prob": fake_prob,
            "real_prob": real_prob,
        }

    # ─── face detection (MTCNN) ──────────────────────────────────────
    def _detect_faces(self, image: Image.Image, aid: str, out: str) -> tuple:
        face_img = image.copy()
        draw = ImageDraw.Draw(face_img)
        count, best_conf = 0, 0.0
        face_crops = []

        if self.mtcnn is not None:
            try:
                # scale down if too large to improve detection
                max_dim = max(image.size)
                scale_factor = 1.0
                if max_dim > 1920:
                    scale_factor = 1920.0 / max_dim
                    new_size = (int(image.width * scale_factor), int(image.height * scale_factor))
                    detect_img = image.resize(new_size, Image.Resampling.LANCZOS)
                else:
                    detect_img = image

                boxes, probs = self.mtcnn.detect(np.array(detect_img))
                
                # retry with smaller size if no faces found on first pass
                if boxes is None and scale_factor == 1.0 and max_dim > 800:
                    scale_factor = 800.0 / max_dim
                    new_size = (int(image.width * scale_factor), int(image.height * scale_factor))
                    detect_img = image.resize(new_size, Image.Resampling.LANCZOS)
                    boxes, probs = self.mtcnn.detect(np.array(detect_img))

                if boxes is not None:
                    for box, prob in zip(boxes, probs):
                        if prob and prob > 0.4:
                            count += 1
                            best_conf = max(best_conf, float(prob) * 100)
                            # Scale boxes back to original image size
                            x1, y1, x2, y2 = [int(c / scale_factor) for c in box]
                            
                            # Extract high-resolution face crop with 20% contextual boundary padding
                            w = x2 - x1
                            h = y2 - y1
                            cx1 = max(0, int(x1 - w * 0.2))
                            cy1 = max(0, int(y1 - h * 0.2))
                            cx2 = min(image.width, int(x2 + w * 0.2))
                            cy2 = min(image.height, int(y2 + h * 0.2))
                            if cx2 > cx1 and cy2 > cy1:
                                face_crops.append(image.crop((cx1, cy1, cx2, cy2)))

                            # Draw bounding box
                            draw.rectangle([x1, y1, x2, y2], outline="#00ff00", width=3)
                            draw.text((x1, max(0, y1 - 14)), f"{prob*100:.1f}%", fill="#00ff00")
            except Exception as e:
                print(f"[DeepTrace] Face detection error: {e}")

        face_img.save(os.path.join(out, f"{aid}_face.jpg"), quality=95)
        return {
            "detected": count > 0,
            "count": count,
            "confidence": round(best_conf, 1),
            "manipulation_score": 0,
        }, face_crops

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
            
            calc_device = self.device
            if self.device.type == 'mps':
                calc_device = torch.device('cpu')
                self.model.to(calc_device)

            pixel_values = inputs["pixel_values"].to(calc_device).requires_grad_(True)

            outputs = self.model(pixel_values=pixel_values)
            pred = outputs.logits.argmax(dim=-1).item()
            self.model.zero_grad()
            outputs.logits[0, pred].backward()

            grads = pixel_values.grad.data.abs().mean(dim=1).squeeze().cpu().numpy()
            
            if self.device.type == 'mps':
                self.model.to(self.device)
            
            # Smooth raw gradients to remove noise (simulates GradCAM blob)
            grads = cv2.GaussianBlur(grads, (11, 11), 0)
            grads = (grads - grads.min()) / (grads.max() - grads.min() + 1e-8)
            
            # Resize to original image size with cubic interpolation
            grads = cv2.resize(grads, (image.width, image.height), interpolation=cv2.INTER_CUBIC)
            
            # Apply a stronger blur to the upscaled heatmap
            blur_radius = min(51, max(image.width, image.height) // 15)
            if blur_radius % 2 == 0: blur_radius += 1
            grads = cv2.GaussianBlur(grads, (blur_radius, blur_radius), 0)
            grads = (grads - grads.min()) / (grads.max() - grads.min() + 1e-8)

            colormap = cv2.applyColorMap(np.uint8(255 * grads), cv2.COLORMAP_JET)
            colormap = cv2.cvtColor(colormap, cv2.COLOR_BGR2RGB)

            overlay = cv2.addWeighted(np.array(image), 0.5, colormap, 0.5, 0)
            Image.fromarray(overlay).save(os.path.join(out, f"{aid}_heatmap.jpg"), quality=95)
            return True

        except Exception as e:
            print(f"[DeepTrace] Heatmap generation error: {e}, using ELA fallback")
            # fallback — simple ELA overlay
            buf = io.BytesIO()
            image.save(buf, "JPEG", quality=85)
            buf.seek(0)
            resaved = Image.open(buf).convert("RGB")
            diff = ImageChops.difference(image, resaved)
            
            # Make a heatmap-like overlay from diff
            diff_np = np.array(diff.convert("L"))
            diff_np = cv2.equalizeHist(diff_np)
            colormap = cv2.applyColorMap(diff_np, cv2.COLORMAP_JET)
            colormap = cv2.cvtColor(colormap, cv2.COLOR_BGR2RGB)
            
            blended = cv2.addWeighted(np.array(image), 0.5, colormap, 0.5, 0)
            Image.fromarray(blended).save(os.path.join(out, f"{aid}_heatmap.jpg"), quality=95)
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
