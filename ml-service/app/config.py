"""
Configuration settings for ML Service
"""
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # API Settings
    API_VERSION: str = "v1"
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    DEBUG: bool = True
    
    # Model Settings
    MODEL_PATH: str = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "saved_models",
        "efficientnetb4_plantvillage.pth"
    )
    NUM_CLASSES: int = 15
    IMAGE_SIZE: int = 380
    
    # CORS - Allowed frontend origins
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:4200",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # File Upload Limits
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: list = ["jpg", "jpeg", "png"]

settings = Settings()