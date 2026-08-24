# DeepTrace Backend

DeepTrace backend is a high-performance REST API and forensic analysis engine for explainable deepfake detection. It orchestrates computer vision models, frequency and compression artifact analysis, metadata integrity checks, and multi-signal ensemble fusion to deliver verifiable verdicts and downloadable forensic reports.

---

## Tech Stack

- **FastAPI & Uvicorn**: Async ASGI web framework and production server
- **PyTorch & HuggingFace Transformers**: Deep learning inference for deepfake classification
- **facenet-pytorch (MTCNN)**: Face detection and bounding box alignment
- **OpenCV & Pillow**: Image processing, Error Level Analysis (ELA), and heatmap rendering
- **ReportLab**: PDF forensic report generation
- **MongoDB Atlas & PyMongo**: User authentication and analysis history storage
- **Cloudinary**: Cloud image asset storage and CDN delivery
- **JWT & Passlib / Bcrypt**: Secure token-based authentication and password hashing

---

## Project Structure

```
backend/
├── main.py                  # FastAPI server
├── analyzer.py              # ML analysis pipeline
├── report.py                # PDF report generator
├── database.py              # MongoDB Atlas integration
├── auth.py                  # JWT + bcrypt auth
├── cloud.py                 # Cloudinary uploads
├── requirements.txt         # Python dependencies
├── models/                  # Trained model weights
├── tests/
│   └── test_e2e.py          # End-to-end integration tests
└── scripts/                 # Training scripts archive
    ├── README.md            # Training history & failures
    └── *.ipynb              # Colab notebooks
```

---

## Modules Overview

- `main.py` — FastAPI server, route definitions, authentication endpoints, static asset serving, and CORS configuration.
- `analyzer.py` — Core ML analysis pipeline: MTCNN face detection, deep learning classification, Error Level Analysis (ELA), Grad-CAM heatmaps, EXIF metadata inspection, and multi-signal fusion.
- `report.py` — ReportLab PDF forensic report generator with styled metrics and embedded visual artifacts.
- `database.py` — MongoDB Atlas connection management and user/analysis CRUD operations.
- `auth.py` — JWT token generation, validation, and bcrypt password hashing utilities.
- `cloud.py` — Cloudinary asset upload and remote URL generation.
- `tests/test_e2e.py` — End-to-end integration and smoke test suite for verification.

---

## Analysis Pipeline

1. **Image Ingestion & EXIF Normalization**: Validates upload format and applies orientation corrections.
2. **MTCNN Face Detection**: Localizes human faces and applies a 20% margin crop for optimal forensic context.
3. **Deep Learning Classification**: Multi-level inference weighting facial crops (65%) and the full scene (35%).
4. **Error Level Analysis (ELA)**: Computes JPEG compression error variance to surface digital splicing and localized editing.
5. **EXIF Metadata Integrity Check**: Inspects image headers for missing camera tags, inconsistent software signatures, or synthetic markers.
6. **Multi-Signal Ensemble Fusion**: Combines neural model confidence, ELA score, and EXIF consistency into a weighted verdict.
7. **Grad-CAM Saliency Heatmap Generation**: Highlights spatial regions in the image that contributed most to the model classification.
8. **Forensic Findings Generation**: Synthesizes explanatory key-value summaries and findings for transparency.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login, returns JWT |
| `GET` | `/api/auth/me` | Get current user profile |
| `POST` | `/api/analyze` | Upload image for forensic analysis |
| `GET` | `/api/history` | Get user's analysis history |
| `GET` | `/api/report/{id}` | Generate PDF forensic report |
| `GET` | `/api/outputs/{file}` | Serve generated images |

---

## Environment Variables

Create a `.env` file in the `backend/` root directory:

```env
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority"
JWT_SECRET="your-jwt-secret-key"
CLOUDINARY_URL="cloudinary://<api_key>:<api_secret>@<cloud_name>"
DEEPTRACE_MODEL="dima806/deepfake_vs_real_image_detection"
```

- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Secret key used for signing and verifying JWT tokens
- `CLOUDINARY_URL` — Cloudinary API credentials for cloud media storage
- `DEEPTRACE_MODEL` — Path to local model weights directory or HuggingFace model repository ID

---

## Setup & Installation

### 1. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the Server

```bash
python main.py
```

The API server starts at `http://localhost:8000`.

### 4. Run Integration Tests

```bash
python tests/test_e2e.py
```
