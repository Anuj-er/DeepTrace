# DeepTrace — Training Scripts Archive

> **Status:** ⚠️ DEPRECATED — This notebook represents our **first training attempt** that revealed critical architectural and dataset mismatches. It is preserved here as documentation of what was tried, what failed, and why we are pivoting to a new approach.

---

## 📂 Contents

| File | Purpose | Status |
|------|---------|--------|
| `DeepTrace_Swin_FineTuning_Colab.ipynb` | Swin Transformer fine-tuning on CIFAKE dataset (Google Colab) | ❌ Completed but fundamentally flawed |
| `README.md` | This file — documents what went wrong and why we changed course | 📄 Current |

### Cleaned Up
The following files were removed because they were byproducts of this deprecated attempt:
- `finetune.py` — a generic fine-tuning helper script, never used standalone
- `finetune_swin_colab.py` — the `.py` equivalent of the Colab notebook (redundant)
- `backend/models/swin_deeptrace_model/` — the trained Swin model weights (347MB)
- `backend/models/swin_deeptrace_model.zip` — the Colab export archive (1.2GB)

Only the **Colab notebook** is preserved because that is the actual artifact we ran on Google Colab.

---

## 🔴 What We Did

### Phase 1: Pre-trained HuggingFace Model (MVP Baseline)
**Model:** [`dima806/deepfake_vs_real_image_detection`](https://huggingface.co/dima806/deepfake_vs_real_image_detection) (EfficientNet-based)  

We started by using a **pre-trained model from HuggingFace** directly in `analyzer.py` without any fine-tuning. This was our MVP to get the full pipeline (MTCNN → classify → ELA → heatmap → PDF) working end-to-end.

**What worked:**
- The entire stack was functional — frontend, backend, face detection, reports
- The pipeline was validated end-to-end with `test_e2e.py`

**Why we needed to move beyond it:**
- It was a **black box** — we had no control over its training data or methodology
- We couldn't verify what data it was trained on or how robust it was
- We needed a custom-trained model to demonstrate as our project

### Phase 2: Swin Transformer + CIFAKE (Our Training Attempt)
**Notebook:** [`DeepTrace_Swin_FineTuning_Colab.ipynb`](./DeepTrace_Swin_FineTuning_Colab.ipynb)  
**Model:** `microsoft/swin-tiny-patch4-window7-224`  
**Dataset:** CIFAKE (120,000 images from Kaggle via `kagglehub`)  

This was our training attempt. The model **was successfully trained on Google Colab (T4 GPU)** and the weights were downloaded and deployed to `backend/models/swin_deeptrace_model/`. The `.env` was updated to point to it.

**However, this approach had FUNDAMENTAL FLAWS:**

---

## 🔴 Critical Failures & Why We Changed the Plan

### Failure #1: CIFAKE Dataset Mismatch (The Biggest Problem)
> **The CIFAKE dataset contains 32×32 pixel images of generic objects (cars, planes, animals, etc.), NOT human faces.**

This is the single most critical mistake. Our backend (`analyzer.py`) uses MTCNN to **crop human faces** before feeding them to the classifier. This means:

- **Training data:** 32×32 general scene images (CIFAR-10 style) — cats, dogs, trucks, ships
- **Inference data:** 224×224 tightly-cropped human face regions

The model learned to distinguish "AI-generated generic objects" from "real CIFAR-10 photos." It **never learned what a manipulated human face looks like** — no blending artifacts around jawlines, no unnatural eye reflections, no GAN frequency signatures specific to face synthesis.

**Impact:** The model's accuracy on actual deepfake face images is essentially **random chance**, because it was trained on a completely different data distribution than what it sees in production.

### Failure #2: Resolution Mismatch (32×32 → 224×224)
CIFAKE images are **32×32 pixels**. The Swin Transformer expects **224×224 pixels**. During training, `RandomResizedCrop(224)` upscaled these tiny 32×32 images to 224×224, introducing massive interpolation artifacts that the model learned as "features."

At inference time, real photographs at 1080p+ have completely different texture distributions. The model learned to recognize **upscaling artifacts**, not actual deepfake manipulation artifacts.

### Failure #3: Why Swin-Tiny Was the Wrong Choice

We used **`microsoft/swin-tiny-patch4-window7-224`** — the smallest Swin variant.

**Why Swin-Tiny specifically was problematic:**

| Swin Variant | Params | Embed Dim | Depths | Best For |
|---|---|---|---|---|
| **Swin-Tiny** (what we used) | 28M | 96 | [2,2,6,2] | Quick experiments, small-scale classification |
| **Swin-Small** | 50M | 96 | [2,2,18,2] | Moderate-scale tasks |
| **Swin-Base** | 88M | 128 | [2,2,18,2] | High-quality image classification, dense prediction |

Even if we'd used Swin-Base, the fundamental problem would remain: **Swin Transformers are architecturally suboptimal for face forensics.** They use shifted-window self-attention designed for global scene understanding, but deepfake detection on cropped faces requires detecting **subtle local pixel-level artifacts** (blending seams, frequency anomalies, texture inconsistencies at face boundaries). EfficientNet and XceptionNet capture these fine-grained local patterns better because of their depthwise separable convolutions which preserve high-frequency spatial information.

**So the question "should we use Swin-Tiny or Swin-Base?" is moot — we should not be using Swin at all for this task.**

### Failure #4: No Face-Specific Data Augmentation
The notebook only used basic augmentations:
```python
train_transforms = Compose([
    RandomResizedCrop(size),
    RandomHorizontalFlip(),
    ToTensor(),
    normalize,
])
```

**What was missing:**
- ❌ **JPEG compression augmentation** — critical for detecting deepfakes shared on social media
- ❌ **Gaussian blur** — simulates low-quality captures and video frame extraction
- ❌ **Gaussian noise** — simulates camera sensor noise and re-encoding artifacts
- ❌ **Color jitter / brightness variation** — real-world lighting conditions
- ❌ **Cutout / random erasing** — forces the model to use multiple facial regions

### Failure #5: Label Mapping Confusion
The notebook had to handle two different label orderings:
```python
# imagefolder assigns labels alphabetically: FAKE=0, REAL=1
# HuggingFace mirror uses: REAL=0, FAKE=1
```

The saved model's `config.json` ended up with `{"0": "Fake", "1": "Real"}`. Meanwhile, `analyzer.py` looked up labels with `.get("Fake", 1)` defaults. This happened to work **by luck**, not by design. If the dataset had loaded differently, labels would have been **silently inverted**.

### Failure #6: No Real-World Validation
We only evaluated on CIFAKE's own test split. No validation was done on:
- Actual deepfake face images (FaceSwap, DeepFaceLab, etc.)
- AI-generated faces (StyleGAN, This Person Does Not Exist)
- Real photographs with heavy compression or filters

---

## 🟢 The New Plan (Why We're Changing Course)

### Architecture Change
- **From:** Swin Transformer (any variant — tiny, small, or base)
- **To:** **EfficientNet-B4** or **XceptionNet** — proven architectures for facial forgery detection

### Dataset Change
- **From:** CIFAKE (32×32 generic objects)
- **To:** **FaceForensics++** or **DFDC subset** — datasets containing actual manipulated/pristine human face images

### Data Pipeline Change
- **From:** Raw `imagefolder` loading with basic transforms
- **To:** Custom pipeline using **MTCNN to crop faces** from training data (matching inference), plus aggressive augmentation (JPEG compression, blur, noise)

---

## 📚 Lessons Learned

1. **Dataset-model alignment is non-negotiable.** If your inference pipeline crops faces, your training data MUST be cropped faces.
2. **Resolution matters.** Training on 32×32 images for a 224×224 model introduces distribution shift.
3. **Architecture should match the task.** CNNs (EfficientNet, Xception) capture local spatial artifacts better than ViTs for face-level forensics.
4. **Augmentation is not optional for forensics.** Social media compression destroys artifacts; you must simulate this during training.
5. **Validate on your actual target domain**, not just the training distribution.
6. **Label mappings must be explicitly verified**, not relied upon via fallback defaults.

---

*Last updated: August 25, 2026*
