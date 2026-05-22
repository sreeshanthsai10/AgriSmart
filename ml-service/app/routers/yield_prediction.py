"""
Yield prediction API endpoints
"""
from fastapi import APIRouter, Query
from typing import Optional
from yield_prediction import predict_yield, get_all_crops

router = APIRouter()

@router.get("/predict")
async def predict(
    crop: str = Query(..., description="Crop name (wheat, rice, maize, etc.)"),
    area: float = Query(..., description="Total area in hectares"),
    rainfall: float = Query(..., description="Average rainfall in mm"),
    temperature: float = Query(..., description="Average temperature in °C"),
    soil_type: str = Query("loam", description="Soil type"),
    fertilizer: str = Query("medium", description="Fertilizer level: low, medium, high"),
    irrigation: str = Query("medium", description="Irrigation level: low, medium, high")
):
    """
    Predict crop yield based on field parameters
    """
    result = predict_yield(
        crop=crop,
        area=area,
        rainfall=rainfall,
        temperature=temperature,
        soil_type=soil_type,
        fertilizer=fertilizer,
        irrigation=irrigation
    )
    return result

@router.get("/crops")
async def list_crops():
    """Get list of supported crops for yield prediction"""
    return {'crops': get_all_crops()}