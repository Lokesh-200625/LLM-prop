from abc import ABC, abstractmethod
from typing import Any

from worker.app.shared.schemas.prediction import PropertyPrediction


class BasePredictor(ABC):
    @abstractmethod
    def load_model(self) -> None:
        """Load model resources into memory. Should implement lazy loading."""
        pass

    @abstractmethod
    def predict(self, input_data: str) -> PropertyPrediction:
        """Run prediction on a single input string and return a standardized prediction object."""
        pass

    @abstractmethod
    def validate_input(self, input_data: str) -> str:
        """Validate and normalize the input string before prediction."""
        pass

    @abstractmethod
    def get_metadata(self) -> dict[str, Any]:
        """Return runtime status and metadata for health checks and orchestration."""
        pass
