import os
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from model import load_all_models, predict, generate_gradcam, is_valid_xray
from transformers import pipeline

load_dotenv()

# ── Global model state ─────────────────────────────────────────────────────────
ml_model = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[startup] Loading all AI models …")
    t0 = time.time()
    loaded_models = load_all_models()
    ml_model.update(loaded_models)
    
    print("[startup] Loading CLIP Semantic Anatomy Discriminator …")
    ml_model["clip"] = pipeline("zero-shot-image-classification", model="openai/clip-vit-base-patch32")
    
    print(f"[startup] Models ready in {time.time() - t0:.2f}s")
    yield
    ml_model.clear()
    print("[shutdown] Models released.")


# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="RadiLens AI — Inference Service",
    description="Pneumonia detection from chest X-ray images using ResNet18, DenseNet121, VGG16",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Schemas ────────────────────────────────────────────────────────────────────
class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    rale_score: int
    severity: str
    model: str = "ResNet18"
    inference_time_ms: float

class HealthResponse(BaseModel):
    status: str
    models_loaded: list[str]

# ── Routes ─────────────────────────────────────────────────────────────────────
@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health():
    return {
        "status": "ok",
        "models_loaded": list(ml_model.keys()),
    }

@app.post("/predict", response_model=PredictionResponse, tags=["Inference"])
async def predict_endpoint(file: UploadFile = File(...)):
    allowed_types = {"image/jpeg", "image/jpg", "image/png"}
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: JPEG, PNG.")
    if "ResNet18" not in ml_model:
        raise HTTPException(status_code=503, detail="Primary model not yet loaded. Try again.")

    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        
    if "clip" not in ml_model:
        raise HTTPException(status_code=503, detail="CLIP model not initialized.")
        
    is_valid, reason = is_valid_xray(ml_model["clip"], image_bytes)
    if not is_valid:
        raise HTTPException(status_code=400, detail=f"INVALID_IMAGE_TYPE: {reason}")

    try:
        t0 = time.time()
        result = predict(ml_model["ResNet18"], image_bytes)
        inference_ms = round((time.time() - t0) * 1000, 2)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")

    return {
        **result,
        "model": "ResNet18",
        "inference_time_ms": inference_ms,
    }

@app.post("/predict-all", tags=["Inference"])
async def predict_all_endpoint(file: UploadFile = File(...)):
    allowed_types = {"image/jpeg", "image/jpg", "image/png"}
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type.")

    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        
    if "clip" not in ml_model:
        raise HTTPException(status_code=503, detail="CLIP model not initialized.")
        
    is_valid, reason = is_valid_xray(ml_model["clip"], image_bytes)
    if not is_valid:
        raise HTTPException(status_code=400, detail=f"INVALID_IMAGE_TYPE: {reason}")
    results = []
    primary_result = None

    for model_name, model in ml_model.items():
        try:
            t0 = time.time()
            res = predict(model, image_bytes)
            inf_ms = round((time.time() - t0) * 1000, 2)
            
            is_primary = (model_name == "ResNet18")
            
            model_res = {
                "name": model_name,
                "prediction": res["prediction"],
                "confidence": res["confidence"],
                "rale_score": res["rale_score"],
                "severity": res["severity"],
                "inference_time_ms": inf_ms,
                "is_primary": is_primary
            }
            results.append(model_res)
            
            if is_primary:
                primary_result = {
                    "prediction": res["prediction"], 
                    "confidence": res["confidence"],
                    "rale_score": res["rale_score"],
                    "severity": res["severity"]
                }
        except Exception as e:
            print(f"Error predicting with {model_name}: {e}")

    # Fallback primary result if ResNet18 failed/missing
    if not primary_result and len(results) > 0:
        primary_result = {
            "prediction": results[0]["prediction"], 
            "confidence": results[0]["confidence"],
            "rale_score": results[0]["rale_score"],
            "severity": results[0]["severity"]
        }

    consensus_counts = {"NORMAL": 0, "PNEUMONIA": 0}
    for r in results:
        consensus_counts[r["prediction"]] += 1
    
    consensus = "PNEUMONIA" if consensus_counts["PNEUMONIA"] >= consensus_counts["NORMAL"] else "NORMAL"

    return {
        "models": results,
        "primary_result": primary_result,
        "consensus": consensus,
        "image_size": [224, 224]
    }

@app.post("/gradcam", tags=["Explainability"])
async def gradcam_endpoint(file: UploadFile = File(...)):
    allowed_types = {"image/jpeg", "image/jpg", "image/png"}
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type.")
    
    image_bytes = await file.read()
    
    if "ResNet18" not in ml_model:
        raise HTTPException(status_code=503, detail="ResNet18 model needed for GradCAM.")
    
    try:
        res = generate_gradcam(ml_model["ResNet18"], image_bytes)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GradCAM failed: {str(e)}")

# ── Dev entrypoint ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host=host, port=port, reload=True)
