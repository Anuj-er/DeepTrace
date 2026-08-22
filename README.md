# DeepTrace — Explainable Deepfake Detection System

An AI-powered forensic tool that detects deepfakes and AI-generated images using deep learning, with full explainability through Grad-CAM heatmaps, Error Level Analysis, and EXIF metadata extraction.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | FastAPI (Python) |
| ML Model | HuggingFace EfficientNet (`dima806/deepfake_vs_real_image_detection`) |
| Face Detection | MTCNN (facenet-pytorch) |
| Explainability | Input-gradient saliency heatmaps |
| Forensics | Error Level Analysis (ELA), EXIF metadata extraction |
| Reports | ReportLab PDF generation |

## Project Structure

```
Project-IORP/
├── backend/
│   ├── main.py            # FastAPI server
│   ├── analyzer.py        # ML analysis pipeline
│   ├── report.py          # PDF report generator
│   └── requirements.txt   # Python dependencies
├── deeptrace-frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/    # Landing, Login, Dashboard, Results, etc.
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup & Run

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server (downloads model on first run ~200MB)
python main.py
```

The API server starts at `http://localhost:8000`.

### 2. Frontend

```bash
cd deeptrace-frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies `/api` calls to the backend.

### 3. Use

1. Open `http://localhost:5173`
2. Login with demo credentials: `demo@deeptrace.ai` / `deeptrace123`
3. Upload an image on the Dashboard
4. View real analysis results — classification, heatmap, ELA, face detection, EXIF
5. Download a PDF forensic report

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/analyze` | Upload image for forensic analysis |
| GET | `/api/report/{id}` | Generate and download PDF report |
| GET | `/api/outputs/{file}` | Serve generated images (heatmap, ELA, etc.) |

## Analysis Pipeline

1. **Classification** — Pre-trained EfficientNet classifies image as Real or Fake
2. **Face Detection** — MTCNN detects and marks faces with bounding boxes
3. **Error Level Analysis** — Detects compression inconsistencies indicating manipulation
4. **Saliency Heatmap** — Input-gradient visualization showing which pixels influenced the decision
5. **EXIF Extraction** — Reads metadata (camera, software, GPS, timestamps)
6. **PDF Report** — Generates a professional forensic report with all findings
