from __future__ import annotations

from typing import Annotated, Any, Literal

from pydantic import BaseModel, Field, field_validator

from worker.app.core.config import get_settings


MAX_TEXT_LENGTH = get_settings().max_text_length


class PredictRequest(BaseModel):
    model: Literal["bandgap"] = "bandgap"
    input: Annotated[str, Field(min_length=1, max_length=MAX_TEXT_LENGTH)]

    @field_validator("input")
    @classmethod
    def normalize_input(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("input is required")
        return normalized


from worker.app.shared.schemas.prediction import PredictionResponse

class PredictResponse(PredictionResponse):
    pass

class HealthResponse(BaseModel):
    status: str
    models: dict[str, dict[str, Any]]
