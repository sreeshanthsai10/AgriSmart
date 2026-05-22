"""
Prediction API endpoints
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.config import settings
from app.models.schemas import (
    DiseaseDetectionResponse,
    BatchDetectionResponse,
    ModelInfoResponse,
    ErrorResponse
)
from app.services.prediction_service import PredictionService
from disease_info import DISEASE_CLASSES, get_disease_info, search_disease, DATASET_STATS
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize service
prediction_service = PredictionService(settings.MODEL_PATH)

@router.post("/predict", response_model=DiseaseDetectionResponse)
async def predict_disease(file: UploadFile = File(...)):
    """
    ## Detect Plant Disease
    
    Upload a leaf image to detect plant diseases.
    
    - **Supported plants**: Apple, Tomato, Potato, Corn, Grape, and more (14 total)
    - **Disease classes**: 38 different conditions
    - **Image formats**: JPG, JPEG, PNG
    
    Returns top 5 predictions with confidence scores and disease information.
    """
    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Check extension
    ext = file.filename.split('.')[-1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Format .{ext} not allowed. Use JPG or PNG")
    
    # Check size
    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    # Predict
    try:
        result = prediction_service.predict_image(contents)
        return result
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict/batch")
async def predict_batch(files: list[UploadFile] = File(...)):
    """Predict multiple images at once (max 10)"""
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 images allowed")
    
    results = []
    for file in files:
        contents = await file.read()
        result = prediction_service.predict_image(contents)
        results.append(result)
    
    avg_time = sum(r['processing_time'] for r in results) / len(results)
    
    return {
        "total_images": len(results),
        "results": results,
        "average_processing_time": round(avg_time, 3)
    }

@router.get("/model-info", response_model=ModelInfoResponse)
async def get_model_info():
    """Get information about the ML model"""
    return prediction_service.get_model_info()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": prediction_service.model_loaded,
        "device": str(prediction_service.model.device),  # Convert to string
        "version": "1.0.0"
    }