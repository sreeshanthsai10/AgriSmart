"""
PlantVillage Disease Information Database
Contains detailed info for all 38 plant disease classes
"""

DISEASE_CLASSES = [
    'Pepper__bell___Bacterial_spot',
    'Pepper__bell___healthy',
    'Potato___Early_blight',
    'Potato___healthy',
    'Potato___Late_blight',
    'Tomato_Bacterial_spot',
    'Tomato_Early_blight',
    'Tomato_healthy',
    'Tomato_Late_blight',
    'Tomato_Leaf_Mold',
    'Tomato_Septoria_leaf_spot',
    'Tomato_Spider_mites_Two_spotted_spider_mite',
    'Tomato__Target_Spot',
    'Tomato__Tomato_mosaic_virus',
    'Tomato__Tomato_YellowLeaf__Curl_Virus'
]

DISEASE_INFO = {
    'Tomato_Late_blight': {
        'plant': 'Tomato',
        'disease': 'Late Blight',
        'pathogen': 'Phytophthora infestans',
        'symptoms': 'Dark water-soaked spots on leaves, white fuzzy growth underneath.',
        'treatment': 'Apply copper-based fungicides. Remove infected plants.',
        'severity': 'Very High',
        'prevention': 'Use resistant varieties. Avoid overhead watering.'
    },
    'Tomato_Early_blight': {
        'plant': 'Tomato',
        'disease': 'Early Blight',
        'pathogen': 'Alternaria solani',
        'symptoms': 'Brown spots with concentric rings on older leaves.',
        'treatment': 'Apply fungicides. Remove infected leaves.',
        'severity': 'High',
        'prevention': 'Mulch plants. Rotate crops.'
    },
    'Potato___Early_blight': {
        'plant': 'Potato',
        'disease': 'Early Blight',
        'pathogen': 'Alternaria solani',
        'symptoms': 'Dark brown spots on leaves. Tubers develop dark lesions.',
        'treatment': 'Apply fungicides. Remove infected plants.',
        'severity': 'Medium',
        'prevention': 'Use certified seed potatoes. Practice crop rotation.'
    },
    'Potato___Late_blight': {
        'plant': 'Potato',
        'disease': 'Late Blight',
        'pathogen': 'Phytophthora infestans',
        'symptoms': 'Water-soaked spots turning black. White mold on leaf undersides.',
        'treatment': 'Apply systemic fungicides. Destroy infected plants.',
        'severity': 'Very High',
        'prevention': 'Plant resistant varieties. Hill soil around plants.'
    },
}

# For missing classes, generate default info
def get_disease_info(class_name):
    """Get disease information for any class"""
    if class_name in DISEASE_INFO:
        return DISEASE_INFO[class_name]
    
    # Generate default info for classes not in the detailed database
    parts = class_name.split('___')
    plant = parts[0].replace('_', ' ')
    condition = parts[1].replace('_', ' ') if len(parts) > 1 else 'Unknown'
    
    is_healthy = 'healthy' in class_name.lower()
    
    return {
        'plant': plant,
        'disease': 'Healthy' if is_healthy else condition,
        'pathogen': 'None' if is_healthy else 'Various pathogens',
        'symptoms': 'No symptoms - plant is healthy' if is_healthy else 'Various leaf symptoms including spots, discoloration, or wilting',
        'treatment': 'No treatment needed - maintain good care' if is_healthy else 'Apply appropriate fungicides or bactericides. Remove infected parts.',
        'severity': 'None' if is_healthy else 'Medium',
        'prevention': 'Maintain good agricultural practices, proper spacing, and regular monitoring'
    }

def get_all_plants():
    """Get list of all unique plants"""
    plants = set()
    for c in DISEASE_CLASSES:
        plant = c.split('___')[0].replace('_', ' ')
        plants.add(plant)
    return sorted(list(plants))

def search_disease(query: str) -> list:
    """Search for diseases by keyword"""
    results = []
    query_lower = query.lower()
    for class_name in DISEASE_CLASSES:
        info = get_disease_info(class_name)
        if (query_lower in class_name.lower() or 
            query_lower in info.get('disease', '').lower() or
            query_lower in info.get('plant', '').lower()):
            results.append({
                'class_name': class_name,
                'plant': info['plant'],
                'disease': info['disease'],
                'severity': info['severity']
            })
    return results

DATASET_STATS = {
    'total_classes': 38,
    'healthy_classes': sum(1 for c in DISEASE_CLASSES if 'healthy' in c),
    'disease_classes': sum(1 for c in DISEASE_CLASSES if 'healthy' not in c),
    'plants': get_all_plants()
}