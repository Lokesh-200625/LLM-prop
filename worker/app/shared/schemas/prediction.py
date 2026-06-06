from typing import Any, Dict, Optional, Union
from datetime import datetime
from pydantic import BaseModel, Field

class PropertyPrediction(BaseModel):
    value: Union[float, str]
    unit: Optional[str] = None
    confidence: Optional[float] = None

class PredictionMetadata(BaseModel):
    """Enhanced metadata for predictions with timing, versioning, and status info."""
    inference_time_ms: Optional[float] = None
    predictors_used: list[str] = Field(default_factory=list)
    model_versions: Dict[str, str] = Field(default_factory=dict)
    generated_at: Optional[str] = None
    failed_predictors: Dict[str, str] = Field(default_factory=dict)

class PredictionResponse(BaseModel):
    properties: Dict[str, PropertyPrediction]
    metadata: PredictionMetadata = Field(default_factory=PredictionMetadata)
