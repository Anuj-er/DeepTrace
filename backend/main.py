"""
DeepTrace API — FastAPI server for deepfake detection.
Run:  python main.py
"""

import os
import shutil
import json

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from analyzer import DeepTraceAnalyzer
from report import generate_pdf_report

# ── directories ──────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── app ──────────────────────────────────────────────────────────────
app = FastAPI(title="DeepTrace API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# serve generated images
app.mount("/api/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")

# ── load model on startup ───────────────────────────────────────────
analyzer: DeepTraceAnalyzer | None = None

# store analysis results in memory (no database needed for demo)
analyses: dict[str, dict] = {}


@app.on_event("startup")
async def startup():
    global analyzer
    analyzer = DeepTraceAnalyzer()
    print("[DeepTrace] Server ready — all models loaded ✓")


# ── endpoints ────────────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {"status": "ok", "model_loaded": analyzer is not None}


@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """Upload an image and run the full forensic analysis pipeline."""

    # validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        return JSONResponse(status_code=400, content={"error": "File must be an image"})

    # save uploaded file
    ext = os.path.splitext(file.filename or "image.jpg")[1] or ".jpg"
    import uuid as _uuid
    upload_name = f"{_uuid.uuid4().hex[:8]}{ext}"
    upload_path = os.path.join(UPLOAD_DIR, upload_name)

    with open(upload_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # run analysis
    try:
        result = analyzer.analyze(upload_path, OUTPUT_DIR)
        analyses[result["id"]] = result
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/api/report/{analysis_id}")
async def get_report(analysis_id: str):
    """Generate and return a PDF forensic report."""

    if analysis_id not in analyses:
        return JSONResponse(status_code=404, content={"error": "Analysis not found"})

    result = analyses[analysis_id]

    try:
        pdf_path = generate_pdf_report(result, OUTPUT_DIR)
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=f"DeepTrace_Report_{analysis_id}.pdf",
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


# ── run ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    print("\n🔬 Starting DeepTrace API server …\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)
