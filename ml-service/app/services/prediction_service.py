"""
Prediction service - handles model inference
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from model_loader import PlantDiseaseModel
from disease_info import DISEASE_CLASSES, get_disease_info
from PIL import Image
import io
import time
import logging

logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model_loaded = False
        self._load_model()
    
    def _load_model(self):
        """Load model"""
        self.model = PlantDiseaseModel(num_classes=15)
        self.model.set_class_names(DISEASE_CLASSES)
        
        if os.path.exists(self.model_path):
            try:
                self.model.load_model(self.model_path)
                self.model_loaded = True
                logger.info("✅ REAL MODEL LOADED!")
            except Exception as e:
                logger.warning(f"Could not load model: {e}")
                self.model_loaded = False
        else:
            logger.info("No model file found")
    
    def predict_image(self, image_bytes: bytes) -> dict:
        start_time = time.time()
        image = Image.open(io.BytesIO(image_bytes))
        
        if self.model_loaded:
            result = self.model.predict(image)
            disease_info = get_disease_info(result['top_prediction']['class_name'])
            
            return {
                'success': True,
                'top_prediction': result['top_prediction'],
                'top_5_predictions': result['top_5_predictions'],
                'disease_info': disease_info,
                'processing_time': round(time.time() - start_time, 3)
            }
        else:
            return {
                'success': False,
                'top_prediction': {'rank': 1, 'class_id': 0, 'class_name': 'Unknown', 'confidence': 0},
                'top_5_predictions': [],
                'disease_info': {},
                'processing_time': 0,
                'error': 'Model not loaded'
            }
    
    def get_model_info(self) -> dict:
        if self.model_loaded:
            return self.model.get_model_info()
        return {
            'architecture': 'EfficientNetB0',
            'num_classes': 15,
            'input_size': '224x224',
            'device': 'cpu',
            'model_loaded': False
        }