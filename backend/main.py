"""
DeepTrace API — FastAPI server for deepfake detection.
Run:  python main.py
"""

import os
import shutil
import uuid
import asyncio
from dotenv import load_dotenv

# Load environment variables from .env file before anything else
load_dotenv()

from fastapi import FastAPI, File, UploadFile, Depends, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr

from analyzer import DeepTraceAnalyzer
from report import generate_pdf_report
from database import init_db, create_user, get_user_by_email, get_user_by_id, save_analysis, get_analyses_by_user, get_analysis_by_id
from auth import hash_password, verify_password, create_access_token, decode_access_token
from cloud import upload_images_to_cloudinary

# ── directories ──────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── config ───────────────────────────────────────────────────────────
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

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


@app.on_event("startup")
async def startup():
    global analyzer
    try:
        init_db()
        print("[DeepTrace] Database initialized ✓")
    except Exception as e:
        print(f"[DeepTrace] Database warning: {e} — continuing without DB")

    analyzer = DeepTraceAnalyzer()
    print("[DeepTrace] Server ready — all models loaded ✓")


# ── auth helpers ─────────────────────────────────────────────────────

async def get_current_user(authorization: str = Header(None)):
    """Extract and validate the JWT token from the Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ", 1)[1]
    payload = decode_access_token(token)
    if not payload:
        return None
    user = get_user_by_id(payload.get("sub"))
    return user


async def require_auth(authorization: str = Header(None)):
    """Dependency that requires a valid JWT token."""
    user = await get_current_user(authorization)
    if not user:
        return None
    return user


# ── auth models ──────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str


# ── auth endpoints ───────────────────────────────────────────────────

@app.post("/api/auth/register")
async def register(req: RegisterRequest):
    """Register a new user account."""
    if not req.name.strip() or not req.email.strip() or not req.password.strip():
        return JSONResponse(status_code=400, content={"error": "All fields are required"})

    if len(req.password) < 6:
        return JSONResponse(status_code=400, content={"error": "Password must be at least 6 characters"})

    # check if user already exists
    existing = get_user_by_email(req.email)
    if existing:
        return JSONResponse(status_code=409, content={"error": "An account with this email already exists"})

    try:
        hashed = hash_password(req.password)
        user = create_user(req.name.strip(), req.email.strip().lower(), hashed)
        token = create_access_token(user["_id"], user["email"])
        return {
            "token": token,
            "user": {"id": user["_id"], "name": user["name"], "email": user["email"]}
        }
    except Exception as e:
        print(f"[DeepTrace] Registration error: {e}")
        return JSONResponse(status_code=500, content={"error": "Registration failed. Please try again."})


@app.post("/api/auth/login")
async def login(req: LoginRequest):
    """Authenticate a user and return a JWT token."""
    user = get_user_by_email(req.email.strip().lower())
    if not user:
        return JSONResponse(status_code=401, content={"error": "Invalid email or password"})

    if not verify_password(req.password, user["hashed_password"]):
        return JSONResponse(status_code=401, content={"error": "Invalid email or password"})

    token = create_access_token(user["_id"], user["email"])
    return {
        "token": token,
        "user": {"id": user["_id"], "name": user["name"], "email": user["email"]}
    }


@app.get("/api/auth/me")
async def get_me(user=Depends(require_auth)):
    """Get the current authenticated user's profile."""
    if not user:
        return JSONResponse(status_code=401, content={"error": "Not authenticated"})
    return {"id": user["_id"], "name": user["name"], "email": user["email"]}


# ── core endpoints ───────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {"status": "ok", "model_loaded": analyzer is not None}


@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...), user=Depends(require_auth)):
    """Upload an image and run the full forensic analysis pipeline."""

    # validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        return JSONResponse(status_code=400, content={"error": "File must be an image"})

    # read file with size check
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        return JSONResponse(status_code=413, content={"error": f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)} MB"})

    # save uploaded file
    ext = os.path.splitext(file.filename or "image.jpg")[1] or ".jpg"
    upload_name = f"{uuid.uuid4().hex[:12]}{ext}"
    upload_path = os.path.join(UPLOAD_DIR, upload_name)

    with open(upload_path, "wb") as f:
        f.write(contents)

    await file.close()

    # check analyzer is loaded
    if analyzer is None:
        return JSONResponse(status_code=503, content={"error": "Model is still loading. Please try again in a moment."})

    # run analysis in a thread to avoid blocking the event loop
    try:
        result = await asyncio.to_thread(analyzer.analyze, upload_path, OUTPUT_DIR)

        # upload to cloudinary (if configured)
        result = await asyncio.to_thread(upload_images_to_cloudinary, result, OUTPUT_DIR)

        # save to database if user is authenticated
        if user:
            try:
                save_analysis(result, user["_id"], file.filename or "unknown")
            except Exception as db_err:
                print(f"[DeepTrace] DB save warning: {db_err}")

        return result
    except Exception as e:
        print(f"[DeepTrace] Analysis error: {e}")
        return JSONResponse(status_code=500, content={"error": "Analysis failed. Please try again with a different image."})


@app.get("/api/report/{analysis_id}")
async def get_report(analysis_id: str):
    """Generate and return a PDF forensic report."""

    # try to load from database first
    result = get_analysis_by_id(analysis_id)

    if not result:
        return JSONResponse(status_code=404, content={"error": "Analysis not found"})

    try:
        pdf_path = await asyncio.to_thread(generate_pdf_report, result, OUTPUT_DIR)
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=f"DeepTrace_Report_{analysis_id}.pdf",
        )
    except Exception as e:
        print(f"[DeepTrace] Report error: {e}")
        return JSONResponse(status_code=500, content={"error": "Failed to generate report. Please try again."})


@app.get("/api/history")
async def get_history(verdict: str = None, sort: str = "newest", user=Depends(require_auth)):
    """Get analysis history for the authenticated user."""
    if not user:
        return JSONResponse(status_code=401, content={"error": "Not authenticated"})

    try:
        analyses = get_analyses_by_user(user["_id"], verdict_filter=verdict, sort=sort)

        # format for frontend
        history = []
        for a in analyses:
            history.append({
                "id": a.get("_id", ""),
                "fileName": a.get("file_name", "Unknown"),
                "date": a.get("created_at", "").strftime("%b %d, %Y %H:%M") if a.get("created_at") else "Unknown",
                "verdict": a.get("verdict", "Unknown"),
                "confidence": a.get("confidence", 0),
                "risk": a.get("risk_level", "Unknown"),
            })

        # compute stats
        total = len(history)
        deepfake = sum(1 for h in history if h["verdict"] == "Deepfake")
        suspicious = sum(1 for h in history if h["verdict"] == "Suspicious")
        authentic = sum(1 for h in history if h["verdict"] == "Authentic")

        return {
            "history": history,
            "stats": {
                "total": total,
                "deepfake": deepfake,
                "suspicious": suspicious,
                "authentic": authentic,
            }
        }
    except Exception as e:
        print(f"[DeepTrace] History error: {e}")
        return JSONResponse(status_code=500, content={"error": "Failed to load history"})


# ── run ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    print("\n🔬 Starting DeepTrace API server …\n")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
