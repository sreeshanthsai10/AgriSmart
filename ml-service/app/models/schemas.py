# """
# Pydantic schemas for request/response models
# """
# from pydantic import BaseModel, Field
# from typing import List, Optional, Dict, Any
# from datetime import datetime

# class PredictionResult(BaseModel):
#     rank: int
#     class_id: int
#     class_name: str
#     confidence: float

# class DiseaseDetectionResponse(BaseModel):
#     success: bool
#     top_prediction: PredictionResult
#     top_5_predictions: List[PredictionResult]
#     disease_info: Optional[Dict[str, Any]] = None
#     processing_time: float
#     timestamp: datetime = Field(default_factory=datetime.now)

# class BatchDetectionResponse(BaseModel):
#     total_images: int
#     results: List[DiseaseDetectionResponse]
#     average_processing_time: float

# class ModelInfoResponse(BaseModel):
#     architecture: str
#     parameters_total: int
#     parameters_trainable: int
#     device: str
#     num_classes: int
#     input_size: str
#     model_loaded: bool

# class DiseaseInfoResponse(BaseModel):
#     plant: str
#     disease: str
#     pathogen: str
#     symptoms: str
#     treatment: str
#     severity: str
#     prevention: str

# class ErrorResponse(BaseModel):
#     error: str
#     detail: Optional[str] = None
#     timestamp: datetime = Field(default_factory=datetime.now)

# class HealthResponse(BaseModel):
#     status: str
#     model_loaded: bool
#     device: str
#     version: str

"""
Pydantic schemas for request/response models
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

class PredictionResult(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    
    rank: int = Field(..., description="Prediction rank (1-5)")
    class_id: int = Field(..., description="Class ID from dataset")
    class_name: str = Field(..., description="Full class name (e.g., Apple___Apple_scab)")
    confidence: float = Field(..., description="Confidence percentage (0-100)")

class DiseaseInfo(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    
    plant: str = Field(..., description="Plant name")
    disease: str = Field(..., description="Disease name")
    pathogen: str = Field(..., description="Causative pathogen")
    symptoms: str = Field(..., description="Visible symptoms")
    treatment: str = Field(..., description="Recommended treatment")
    severity: str = Field(..., description="Disease severity level")
    prevention: str = Field(..., description="Prevention measures")

class DiseaseDetectionResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    
    success: bool = Field(default=True, description="Prediction success status")
    top_prediction: PredictionResult = Field(..., description="Highest confidence prediction")
    top_5_predictions: List[PredictionResult] = Field(..., description="Top 5 predictions")
    disease_info: Optional[Dict[str, Any]] = Field(None, description="Detailed disease information")
    processing_time: float = Field(..., description="Inference time in seconds")
    timestamp: datetime = Field(default_factory=datetime.now, description="Prediction timestamp")

class BatchDetectionResponse(BaseModel):
    total_images: int = Field(..., description="Number of images processed")
    results: List[DiseaseDetectionResponse] = Field(..., description="Individual results")
    average_processing_time: float = Field(..., description="Average processing time")

class ModelInfoResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    
    architecture: str = ""
    parameters_total: int = 0
    parameters_trainable: int = 0
    device: str = ""
    num_classes: int = 0
    input_size: str = ""
    model_loaded: bool = False

class HealthResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    
    status: str = Field(..., description="Service status")
    model_loaded: bool = Field(..., description="Model load status")
    device: str = Field(..., description="Computation device")
    version: str = Field(..., description="API version")

class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error info")
    timestamp: datetime = Field(default_factory=datetime.now)

class PlantInfo(BaseModel):
    plant_name: str
    total_diseases: int
    diseases: List[Dict[str, str]]

class DiseaseClassInfo(BaseModel):
    class_name: str
    plant: str
    disease: str
    severity: str
    is_healthy: bool