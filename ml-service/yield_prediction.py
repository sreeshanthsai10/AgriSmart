"""
Crop Yield Prediction Module for AGRISMART
Predicts harvest volume based on field parameters
"""

# Base yield data (tons/hectare) - Indian agriculture standards
CROP_YIELD_BASE = {
    'wheat': {'base_yield': 3.5, 'unit': 'tons/hectare', 'min': 2.0, 'max': 6.0},
    'rice': {'base_yield': 4.0, 'unit': 'tons/hectare', 'min': 2.5, 'max': 7.0},
    'maize': {'base_yield': 3.0, 'unit': 'tons/hectare', 'min': 1.5, 'max': 5.5},
    'corn': {'base_yield': 3.0, 'unit': 'tons/hectare', 'min': 1.5, 'max': 5.5},
    'potato': {'base_yield': 20.0, 'unit': 'tons/hectare', 'min': 12.0, 'max': 30.0},
    'tomato': {'base_yield': 25.0, 'unit': 'tons/hectare', 'min': 15.0, 'max': 40.0},
    'cotton': {'base_yield': 2.5, 'unit': 'tons/hectare', 'min': 1.0, 'max': 4.0},
    'sugarcane': {'base_yield': 70.0, 'unit': 'tons/hectare', 'min': 50.0, 'max': 100.0},
    'groundnut': {'base_yield': 1.8, 'unit': 'tons/hectare', 'min': 1.0, 'max': 3.0},
    'soybean': {'base_yield': 1.5, 'unit': 'tons/hectare', 'min': 0.8, 'max': 2.5},
    'onion': {'base_yield': 16.0, 'unit': 'tons/hectare', 'min': 10.0, 'max': 25.0},
    'pepper': {'base_yield': 12.0, 'unit': 'tons/hectare', 'min': 7.0, 'max': 18.0},
}

# Soil quality multipliers
SOIL_QUALITY = {
    'loam': 1.15,
    'loamy': 1.15,
    'silty': 1.05,
    'clay': 0.90,
    'sandy': 0.75,
    'black': 1.10,
    'red': 0.85,
    'alluvial': 1.20,
}

# Weather impact factors
def calculate_weather_factor(rainfall, temperature, crop):
    """Calculate weather impact on yield"""
    optimal = {
        'wheat': {'rainfall': (100, 150), 'temp': (18, 24)},
        'rice': {'rainfall': (200, 300), 'temp': (25, 35)},
        'maize': {'rainfall': (150, 250), 'temp': (20, 30)},
        'corn': {'rainfall': (150, 250), 'temp': (20, 30)},
        'potato': {'rainfall': (100, 150), 'temp': (15, 20)},
        'tomato': {'rainfall': (80, 120), 'temp': (20, 27)},
        'cotton': {'rainfall': (120, 180), 'temp': (25, 35)},
        'sugarcane': {'rainfall': (200, 300), 'temp': (25, 35)},
        'groundnut': {'rainfall': (100, 150), 'temp': (25, 30)},
        'soybean': {'rainfall': (100, 150), 'temp': (20, 30)},
        'onion': {'rainfall': (80, 120), 'temp': (15, 25)},
        'pepper': {'rainfall': (80, 120), 'temp': (20, 30)},
    }
    
    crop_optimal = optimal.get(crop.lower(), {'rainfall': (100, 200), 'temp': (20, 30)})
    
    # Rainfall factor (0.5 to 1.5)
    rain_opt_min, rain_opt_max = crop_optimal['rainfall']
    if rainfall < rain_opt_min:
        rain_factor = 0.5 + (rainfall / rain_opt_min) * 0.5
    elif rainfall > rain_opt_max:
        rain_factor = max(0.5, 1.5 - (rainfall - rain_opt_max) / rain_opt_max)
    else:
        rain_factor = 1.0
    
    # Temperature factor (0.5 to 1.5)
    temp_opt_min, temp_opt_max = crop_optimal['temp']
    if temperature < temp_opt_min:
        temp_factor = 0.5 + (temperature / temp_opt_min) * 0.5
    elif temperature > temp_opt_max:
        temp_factor = max(0.5, 1.5 - (temperature - temp_opt_max) / temp_opt_max)
    else:
        temp_factor = 1.0
    
    return rain_factor * 0.6 + temp_factor * 0.4

def predict_yield(crop, area, rainfall, temperature, soil_type, fertilizer='medium', irrigation='medium'):
    """
    Predict crop yield
    
    Args:
        crop: Crop name
        area: Total area in hectares
        rainfall: Average rainfall in mm
        temperature: Average temperature in °C
        soil_type: Type of soil
        fertilizer: 'low', 'medium', 'high'
        irrigation: 'low', 'medium', 'high'
    
    Returns:
        Dictionary with yield prediction
    """
    crop = crop.lower()
    
    # Get base yield
    crop_data = CROP_YIELD_BASE.get(crop, {'base_yield': 3.0, 'unit': 'tons/hectare'})
    base_yield = crop_data['base_yield']
    
    # Soil factor
    soil_factor = SOIL_QUALITY.get(soil_type.lower(), 1.0)
    
    # Weather factor
    weather_factor = calculate_weather_factor(rainfall, temperature, crop)
    
    # Management factors
    fertilizer_factors = {'low': 0.8, 'medium': 1.0, 'high': 1.2}
    irrigation_factors = {'low': 0.7, 'medium': 1.0, 'high': 1.3}
    
    fert_factor = fertilizer_factors.get(fertilizer, 1.0)
    irr_factor = irrigation_factors.get(irrigation, 1.0)
    
    # Calculate final yield
    predicted_yield_per_hectare = base_yield * soil_factor * weather_factor * fert_factor * irr_factor
    total_yield = predicted_yield_per_hectare * area
    
    # Confidence based on how optimal conditions are
    confidence = min(95, max(60, int(weather_factor * 100)))
    
    # Generate insights
    insights = []
    
    if soil_factor > 1.1:
        insights.append(f"Excellent soil quality (+{int((soil_factor-1)*100)}% boost)")
    elif soil_factor < 0.9:
        insights.append("Consider soil improvement for better yields")
    
    if rainfall < 80:
        insights.append("Low rainfall - irrigation strongly recommended")
    elif rainfall > 250:
        insights.append("High rainfall - ensure proper drainage")
    
    if temperature > 30:
        insights.append("High temperature may stress crops")
    
    return {
        'crop': crop.title(),
        'area': area,
        'predicted_yield': round(total_yield, 2),
        'yield_per_hectare': round(predicted_yield_per_hectare, 2),
        'unit': crop_data['unit'],
        'confidence': confidence,
        'factors': {
            'base_yield': base_yield,
            'soil_multiplier': round(soil_factor, 2),
            'weather_multiplier': round(weather_factor, 2),
            'management_multiplier': round(fert_factor * irr_factor, 2)
        },
        'insights': insights,
        'range': {
            'min': round(total_yield * 0.8, 2),
            'max': round(total_yield * 1.2, 2)
        }
    }

def get_all_crops():
    """Get list of supported crops"""
    return list(CROP_YIELD_BASE.keys())