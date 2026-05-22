"""
Seasonal Crop Recommendation System for AGRISMART
Recommends crops based on season, soil type, and climate
"""

# Crop database with seasonal information
CROP_DATABASE = {
    'summer': {
        'vegetables': [
            {'name': 'Tomato', 'varieties': ['Roma', 'Cherry', 'Beefsteak'], 'days_to_harvest': 60, 'water_needs': 'Medium'},
            {'name': 'Cucumber', 'varieties': ['English', 'Pickling'], 'days_to_harvest': 50, 'water_needs': 'High'},
            {'name': 'Eggplant', 'varieties': ['Black Beauty', 'Japanese'], 'days_to_harvest': 70, 'water_needs': 'Medium'},
            {'name': 'Pepper', 'varieties': ['Bell', 'Jalapeno', 'Cayenne'], 'days_to_harvest': 65, 'water_needs': 'Medium'},
            {'name': 'Okra', 'varieties': ['Clemson Spineless'], 'days_to_harvest': 55, 'water_needs': 'Low'},
        ],
        'fruits': [
            {'name': 'Watermelon', 'varieties': ['Sugar Baby', 'Crimson Sweet'], 'days_to_harvest': 80, 'water_needs': 'Medium'},
            {'name': 'Muskmelon', 'varieties': ['Kajri', 'Hara Madhu'], 'days_to_harvest': 75, 'water_needs': 'Medium'},
        ],
        'grains': [
            {'name': 'Corn (Maize)', 'varieties': ['Sweet Corn', 'Dent Corn'], 'days_to_harvest': 90, 'water_needs': 'High'},
            {'name': 'Rice', 'varieties': ['Basmati', 'IR64'], 'days_to_harvest': 120, 'water_needs': 'Very High'},
        ]
    },
    'winter': {
        'vegetables': [
            {'name': 'Potato', 'varieties': ['Kufri Jyoti', 'Kufri Chandramukhi'], 'days_to_harvest': 80, 'water_needs': 'Medium'},
            {'name': 'Carrot', 'varieties': ['Nantes', 'Danvers'], 'days_to_harvest': 70, 'water_needs': 'Medium'},
            {'name': 'Cauliflower', 'varieties': ['Snowball', 'Pusa Early'], 'days_to_harvest': 65, 'water_needs': 'High'},
            {'name': 'Cabbage', 'varieties': ['Golden Acre', 'Red Acre'], 'days_to_harvest': 75, 'water_needs': 'High'},
            {'name': 'Peas', 'varieties': ['Arkel', 'Bonneville'], 'days_to_harvest': 60, 'water_needs': 'Medium'},
            {'name': 'Spinach', 'varieties': ['All Green', 'Pusa Jyoti'], 'days_to_harvest': 40, 'water_needs': 'Medium'},
        ],
        'fruits': [
            {'name': 'Strawberry', 'varieties': ['Chandler', 'Camarosa'], 'days_to_harvest': 60, 'water_needs': 'Medium'},
        ],
        'grains': [
            {'name': 'Wheat', 'varieties': ['HD 2967', 'PBW 343'], 'days_to_harvest': 140, 'water_needs': 'Medium'},
            {'name': 'Barley', 'varieties': ['DWRB 101', 'RD 2035'], 'days_to_harvest': 130, 'water_needs': 'Low'},
        ]
    },
    'spring': {
        'vegetables': [
            {'name': 'Lettuce', 'varieties': ['Iceberg', 'Romaine'], 'days_to_harvest': 45, 'water_needs': 'High'},
            {'name': 'Radish', 'varieties': ['White Icicle', 'Cherry Belle'], 'days_to_harvest': 25, 'water_needs': 'Medium'},
            {'name': 'Onion', 'varieties': ['Red', 'White', 'Yellow'], 'days_to_harvest': 100, 'water_needs': 'Medium'},
        ],
        'fruits': [
            {'name': 'Apple', 'varieties': ['Red Delicious', 'Granny Smith'], 'days_to_harvest': 150, 'water_needs': 'Medium'},
        ]
    },
    'rainy': {
        'vegetables': [
            {'name': 'Brinjal', 'varieties': ['Pusa Purple', 'Arka Keshav'], 'days_to_harvest': 65, 'water_needs': 'Medium'},
            {'name': 'Bitter Gourd', 'varieties': ['Palee', 'Arka Harit'], 'days_to_harvest': 55, 'water_needs': 'Medium'},
            {'name': 'Bottle Gourd', 'varieties': ['Pusa Naveen'], 'days_to_harvest': 60, 'water_needs': 'High'},
        ],
        'grains': [
            {'name': 'Rice', 'varieties': ['IR36', 'Jaya'], 'days_to_harvest': 115, 'water_needs': 'Very High'},
            {'name': 'Sorghum', 'varieties': ['CSH 14', 'CSV 15'], 'days_to_harvest': 100, 'water_needs': 'Low'},
        ]
    }
}

# Soil type mappings
SOIL_CROP_MAPPING = {
    'clay': ['Rice', 'Wheat', 'Cabbage', 'Cauliflower'],
    'sandy': ['Carrot', 'Potato', 'Radish', 'Groundnut'],
    'loam': ['Tomato', 'Corn', 'Pepper', 'Cucumber', 'Onion'],
    'silty': ['Lettuce', 'Spinach', 'Peas', 'Beans'],
    'black': ['Cotton', 'Wheat', 'Sorghum', 'Sunflower'],
    'red': ['Groundnut', 'Pulses', 'Millets', 'Tobacco']
}

# Climate zones in India
CLIMATE_ZONES = {
    'tropical': {'states': ['Kerala', 'Tamil Nadu', 'Goa'], 'seasons': ['summer', 'rainy', 'winter']},
    'subtropical': {'states': ['Punjab', 'UP', 'Bihar'], 'seasons': ['summer', 'winter', 'spring']},
    'arid': {'states': ['Rajasthan', 'Gujarat'], 'seasons': ['summer', 'winter']},
    'temperate': {'states': ['Himachal', 'Uttarakhand'], 'seasons': ['summer', 'spring']}
}

def get_current_season(month=None):
    """Get current season based on month"""
    from datetime import datetime
    
    if month is None:
        month = datetime.now().month
    
    if month in [3, 4, 5]:
        return 'summer'
    elif month in [6, 7, 8, 9]:
        return 'rainy'
    elif month in [10, 11]:
        return 'spring'
    else:
        return 'winter'

def recommend_crops(season=None, soil_type=None, state=None, water_availability='medium'):
    """
    Recommend crops based on season and conditions
    
    Args:
        season: 'summer', 'winter', 'spring', 'rainy'
        soil_type: 'clay', 'sandy', 'loam', 'silty', 'black', 'red'
        state: Indian state name
        water_availability: 'low', 'medium', 'high'
    """
    if season is None:
        season = get_current_season()
    
    recommendations = []
    
    # Get crops for season
    seasonal_crops = CROP_DATABASE.get(season, {})
    
    for category, crops in seasonal_crops.items():
        for crop in crops:
            # Score the crop
            score = 5  # Base score
            reasons = []
            
            # Check soil compatibility
            if soil_type:
                soil_crops = SOIL_CROP_MAPPING.get(soil_type, [])
                if crop['name'] in soil_crops:
                    score += 3
                    reasons.append(f"Suited for {soil_type} soil")
                elif any(c in soil_crops for c in [crop['name']]):
                    score += 1
            
            # Check water compatibility
            water_map = {'low': 0, 'medium': 1, 'high': 2, 'very high': 3}
            crop_water = water_map.get(crop['water_needs'].lower(), 1)
            user_water = water_map.get(water_availability.lower(), 1)
            
            if abs(crop_water - user_water) <= 1:
                score += 2
                reasons.append("Water requirements match")
            
            # Season match
            score += 2
            reasons.append(f"Ideal for {season} season")
            
            recommendations.append({
                'crop': crop['name'],
                'category': category,
                'varieties': crop['varieties'],
                'days_to_harvest': crop['days_to_harvest'],
                'score': score,
                'reasons': reasons
            })
    
    # Sort by score
    recommendations.sort(key=lambda x: x['score'], reverse=True)
    
    return {
        'season': season,
        'soil_type': soil_type,
        'total_recommendations': len(recommendations),
        'top_crops': recommendations[:10],
        'all_crops': recommendations
    }

def get_crop_calendar(season=None):
    """Get planting calendar for a season"""
    if season is None:
        season = get_current_season()
    
    calendar = []
    seasonal_crops = CROP_DATABASE.get(season, {})
    
    for category, crops in seasonal_crops.items():
        for crop in crops:
            calendar.append({
                'crop': crop['name'],
                'category': category,
                'planting_month': get_planting_month(season, crop['name']),
                'harvest_days': crop['days_to_harvest'],
                'care_tips': get_care_tips(crop['name'])
            })
    
    return {
        'season': season,
        'crops': sorted(calendar, key=lambda x: x['harvest_days'])
    }

def get_planting_month(season, crop_name):
    """Get recommended planting month"""
    planting_months = {
        'summer': 'March-April',
        'winter': 'October-November',
        'spring': 'February-March',
        'rainy': 'June-July'
    }
    return planting_months.get(season, 'Varies')

def get_care_tips(crop_name):
    """Get care tips for specific crops"""
    tips = {
        'Tomato': 'Stake plants, water regularly, watch for blight',
        'Potato': 'Hill soil around plants, well-drained soil required',
        'Corn': 'Plant in blocks for pollination, heavy feeder',
        'Rice': 'Maintain standing water, high nitrogen needed',
        'Wheat': 'Well-drained loamy soil, moderate watering',
        'Carrot': 'Loose soil required, thin seedlings early',
        'Cabbage': 'Heavy feeder, watch for caterpillars',
        'Spinach': 'Quick growing, partial shade in summer',
        'Onion': 'Well-drained soil, stop watering near harvest',
        'Pepper': 'Warm soil needed, mulch to retain moisture',
    }
    return tips.get(crop_name, 'Regular watering, proper spacing, pest monitoring')

def search_crops(query):
    """Search crops by name"""
    results = []
    for season, categories in CROP_DATABASE.items():
        for category, crops in categories.items():
            for crop in crops:
                if query.lower() in crop['name'].lower():
                    results.append({
                        'crop': crop['name'],
                        'season': season,
                        'category': category,
                        'days_to_harvest': crop['days_to_harvest']
                    })
    return results