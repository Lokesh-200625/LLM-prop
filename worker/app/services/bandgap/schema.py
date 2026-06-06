from __future__ import annotations

from typing import Annotated, Any

from pydantic import BaseModel, Field, field_validator

from worker.app.core.config import get_settings


MAX_TEXT_LENGTH = get_settings().max_text_length


class BandGapRequest(BaseModel):
    text: Annotated[str, Field(min_length=1, max_length=MAX_TEXT_LENGTH)]

    @field_validator("text")
    @classmethod
    def normalize_text(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("text is required")
        return normalized


from worker.app.shared.schemas.prediction import PredictionResponse

class BandGapResponse(PredictionResponse):
    pass


class BatchBandGapRequest(BaseModel):
    texts: Annotated[list[str], Field(min_length=1, max_length=100)]

    @field_validator("texts")
    @classmethod
    def normalize_texts(cls, value: list[str]) -> list[str]:
        normalized = [item.strip() for item in value if item.strip()]
        if not normalized:
            raise ValueError("at least one non-empty text is required")
        return normalized


class BatchBandGapItem(BaseModel):
    index: int
    text: str
    prediction: float | None = None
    unit: str = "eV"
    error: str | None = None


class BatchBandGapResponse(BaseModel):
    model: str = "bandgap"
    results: list[BatchBandGapItem]
    total: int
    succeeded: int
    failed: int
