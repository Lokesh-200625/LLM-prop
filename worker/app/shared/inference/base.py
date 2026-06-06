from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class PredictionResult:
    model: str
    value: float
    unit: str
    metadata: dict[str, Any]


class BaseModelService(ABC):
    name: str

    @abstractmethod
    def load(self) -> None:
        """Load model resources into memory."""

    @abstractmethod
    def status(self) -> dict[str, Any]:
        """Return runtime status for health checks."""

    @abstractmethod
    def predict(self, model_input: str) -> PredictionResult:
        """Run a single prediction."""
