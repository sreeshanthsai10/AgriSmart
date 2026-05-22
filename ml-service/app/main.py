"""
AGRISMART - Plant Disease Detection API
Main FastAPI application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import predict, diseases, crops, yield_prediction
import uvicorn
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="AGRISMART - Plant Disease Detection",
    description="""
    ## 🌿 Plant Disease Detection API
    
    Detect 38 different plant diseases across 14 plant species using EfficientNetB4 deep learning model.
    
    ### Features:
    - **Real-time detection** from leaf images
    - **Top-5 predictions** with confidence scores
    - **Detailed disease info** including symptoms and treatments
    - **14 plant species** supported
    
    ### How to use:
    1. **POST /api/v1/predict** - Upload a leaf image
    2. **GET /api/v1/diseases** - Browse all disease classes
    3. **GET /api/v1/plants** - See supported plants
    
    ### Model: EfficientNetB4
    Training script available at: `train.py`
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(predict.router, prefix=f"/api/{settings.API_VERSION}", tags=["Prediction"])
app.include_router(diseases.router, prefix=f"/api/{settings.API_VERSION}", tags=["Diseases"])
app.include_router(crops.router, prefix=f"/api/{settings.API_VERSION}/crops", tags=["Crops"])
app.include_router(yield_prediction.router, prefix=f"/api/{settings.API_VERSION}/yield", tags=["Yield Prediction"])
@app.get("/")
async def root():
    return {
        "service": "AGRISMART Plant Disease Detection",
        "version": "1.0.0",
        "status": "active",
        "docs": "/docs",
        "endpoints": {
            "predict": f"/api/{settings.API_VERSION}/predict",
            "diseases": f"/api/{settings.API_VERSION}/diseases",
            "plants": f"/api/{settings.API_VERSION}/plants",
            "health": f"/api/{settings.API_VERSION}/health"
        }
    }

if __name__ == "__main__":
    logger.info(f"Starting AGRISMART ML Service on port {settings.PORT}")
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )