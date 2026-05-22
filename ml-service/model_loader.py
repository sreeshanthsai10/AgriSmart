import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PlantDiseaseModel:
    def __init__(self, model_path: str = None, num_classes: int = 15):
        self.device = torch.device('cpu')
        self.num_classes = num_classes
        self.model = None
        self.class_names = None
        
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
        
        if model_path and os.path.exists(model_path):
            self.load_model(model_path)
    
    def load_model(self, model_path):
        self.model = models.efficientnet_b0(weights=None)
        # Match the exact architecture from fine-tuning
        self.model.classifier[1] = nn.Linear(1280, self.num_classes)
        
        state_dict = torch.load(model_path, map_location='cpu')
        self.model.load_state_dict(state_dict)
        self.model.eval()
        logger.info("✅ Model loaded!")
    
    def predict(self, image, top_k=5):
        if image.mode != 'RGB':
            image = image.convert('RGB')
        tensor = self.transform(image).unsqueeze(0)
        
        with torch.no_grad():
            out = self.model(tensor)
            probs = torch.nn.functional.softmax(out, dim=1)
        
        top_probs, top_idx = torch.topk(probs, top_k)
        
        predictions = []
        for i, (p, idx) in enumerate(zip(top_probs[0], top_idx[0])):
            name = self.class_names[idx.item()] if self.class_names else f"Class_{idx.item()}"
            predictions.append({
                'rank': i+1,
                'class_id': idx.item(),
                'class_name': name,
                'confidence': round(p.item()*100, 2)
            })
        
        return {
            'top_prediction': predictions[0],
            'top_5_predictions': predictions
        }
    
    def set_class_names(self, names):
        self.class_names = names
    
    def get_model_info(self):
        return {
            'architecture': 'EfficientNetB0',
            'parameters_total': sum(p.numel() for p in self.model.parameters()) if self.model else 0,
            'parameters_trainable': 0,
            'device': 'cpu',
            'num_classes': 15,
            'input_size': '224x224',
            'model_loaded': self.model is not None
        }