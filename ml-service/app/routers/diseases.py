"""
Disease information endpoints
"""
from fastapi import APIRouter, HTTPException, Query
from disease_info import (
    DISEASE_CLASSES,
    get_disease_info,
    get_all_plants,
    search_disease,
    DATASET_STATS
)

router = APIRouter()

@router.get("/diseases")
async def list_all_diseases():
    """Get list of all 38 disease classes"""
    diseases = []
    for class_name in DISEASE_CLASSES:
        info = get_disease_info(class_name)
        diseases.append({
            'class_name': class_name,
            'plant': info['plant'],
            'disease': info['disease'],
            'severity': info['severity'],
            'is_healthy': 'healthy' in class_name
        })
    
    return {
        'total': len(diseases),
        'diseases': diseases
    }

@router.get("/diseases/{class_name}")
async def get_disease_details(class_name: str):
    """Get detailed info for a specific disease class"""
    if class_name not in DISEASE_CLASSES:
        raise HTTPException(status_code=404, detail=f"Class '{class_name}' not found")
    
    return get_disease_info(class_name)

@router.get("/plants")
async def list_plants():
    """Get all 14 plant species"""
    return {
        'total': len(DATASET_STATS['plants']),
        'plants': DATASET_STATS['plants']
    }

@router.get("/plants/{plant_name}/diseases")
async def get_plant_diseases(plant_name: str):
    """Get diseases for a specific plant"""
    diseases = []
    for class_name in DISEASE_CLASSES:
        if plant_name.lower() in class_name.lower():
            info = get_disease_info(class_name)
            diseases.append({
                'class_name': class_name,
                'disease': info['disease'],
                'severity': info['severity']
            })
    
    if not diseases:
        raise HTTPException(status_code=404, detail=f"Plant '{plant_name}' not found")
    
    return {
        'plant': plant_name,
        'total_diseases': len(diseases),
        'diseases': diseases
    }

@router.get("/search")
async def search_diseases(q: str = Query(..., min_length=2)):
    """Search diseases by keyword"""
    results = search_disease(q)
    return {
        'query': q,
        'results_count': len(results),
        'results': results
    }

@router.get("/stats")
async def get_stats():
    """Get dataset statistics"""
    return DATASET_STATS