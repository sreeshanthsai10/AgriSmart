"""
Crop recommendation API endpoints
"""
from fastapi import APIRouter, Query
from typing import Optional
from crop_recommendation import (
    recommend_crops, 
    get_current_season, 
    get_crop_calendar,
    search_crops,
    SOIL_CROP_MAPPING,
    CROP_DATABASE
)

router = APIRouter()

@router.get("/recommend")
async def get_recommendations(
    season: Optional[str] = Query(None, description="summer, winter, spring, rainy"),
    soil_type: Optional[str] = Query(None, description="clay, sandy, loam, silty, black, red"),
    water: Optional[str] = Query("medium", description="low, medium, high")
):
    """
    Get crop recommendations based on season and soil
    """
    if season is None:
        season = get_current_season()
    
    result = recommend_crops(
        season=season,
        soil_type=soil_type,
        water_availability=water
    )
    
    return result

@router.get("/calendar")
async def get_calendar(season: Optional[str] = Query(None)):
    """Get planting calendar for a season"""
    result = get_crop_calendar(season)
    return result

@router.get("/current-season")
async def current_season():
    """Get current growing season"""
    season = get_current_season()
    return {
        'current_season': season,
        'crops_count': sum(len(crops) for crops in CROP_DATABASE.get(season, {}).values())
    }

@router.get("/soil-types")
async def get_soil_types():
    """Get soil types and compatible crops"""
    return SOIL_CROP_MAPPING

@router.get("/search")
async def search_crop(q: str = Query(..., min_length=2)):
    """Search for crops"""
    return search_crops(q)

@router.get("/all-seasons")
async def all_seasons():
    """Get crops for all seasons"""
    result = {}
    for season, categories in CROP_DATABASE.items():
        total = sum(len(crops) for crops in categories.values())
        result[season] = {
            'total_crops': total,
            'categories': list(categories.keys())
        }
    return result