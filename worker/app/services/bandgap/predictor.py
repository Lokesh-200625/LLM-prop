from __future__ import annotations

from typing import Any

import numpy as np

from worker.app.core.base_predictor import BasePredictor
from worker.app.core.exceptions import PredictorInferenceError, PredictorLoadError, PredictorValidationError
from worker.app.core.model_paths import MODEL_PATHS, TOKENIZER_PATHS
from worker.app.services.bandgap.model_loader import ModelBundle, load_model_bundle
from worker.app.services.bandgap.utils import finite_prediction
from worker.app.shared.preprocessing.text import normalize_text
from worker.app.shared.schemas.prediction import PropertyPrediction
from worker.app.shared.validation.text import validate_non_empty_text


class BandGapService(BasePredictor):
    name = "band_gap"
    version = "bandgap-v1"

    def __init__(self, device: str | None = None) -> None:
        self.requested_device = device
        self.bundle: ModelBundle | None = None

    @property
    def device(self) -> str:
        return self.bundle.device if self.bundle else "unloaded"

    def load_model(self) -> None:
        if self.bundle is None:
            try:
                self.bundle = load_model_bundle(
                    model_file=MODEL_PATHS["band_gap"],
                    tokenizer_dir=TOKENIZER_PATHS["band_gap"],
                    device=self.requested_device
                )
            except Exception as exc:
                raise PredictorLoadError(f"Failed to load band gap predictor: {exc}") from exc

    def get_metadata(self) -> dict[str, Any]:
        return {
            "name": self.name,
            "version": self.version,
            "ready": self.bundle is not None,
            "device": str(self.device),
            "max_length": self.bundle.max_length if self.bundle else None,
            "model_path": str(MODEL_PATHS["band_gap"]),
        }

    def load(self) -> None:
        self.load_model()

    def status(self) -> dict[str, Any]:
        return self.get_metadata()

    def validate_input(self, input_data: str) -> str:
        try:
            return validate_non_empty_text(normalize_text(input_data))
        except ValueError as exc:
            raise PredictorValidationError(str(exc)) from exc

    def predict(self, input_data: str) -> PropertyPrediction:
        if self.bundle is None:
            self.load_model()

        if self.bundle is None:
            raise PredictorLoadError("Bandgap model is not loaded.")

        cleaned_text = self.validate_input(input_data)
        try:
            encoding = self.bundle.tokenizer(
                cleaned_text,
                return_tensors="np",
                truncation=True,
                padding="max_length",
                max_length=self.bundle.max_length,
            )
        except Exception as exc:
            raise PredictorInferenceError(f"Failed to tokenize input: {exc}") from exc

        model_inputs = {
            key: np.asarray(value, dtype=np.int64)
            for key, value in encoding.items()
            if key in self.bundle.input_names
        }
        if not model_inputs:
            raise PredictorInferenceError("No compatible model inputs were produced by the tokenizer.")

        try:
            outputs = self.bundle.model.run(None, model_inputs)
        except Exception as exc:
            raise PredictorInferenceError(f"Bandgap inference failed: {exc}") from exc

        try:
            prediction = finite_prediction(float(np.asarray(outputs[0]).reshape(-1)[0]))
        except Exception as exc:
            raise PredictorInferenceError(f"Invalid bandgap output: {exc}") from exc

        return PropertyPrediction(
            value=prediction,
            unit="eV",
            confidence=None  # To be populated by future confidence estimation models
        )
