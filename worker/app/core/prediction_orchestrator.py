from typing import Any
import time
from datetime import datetime

from worker.app.core.exceptions import PredictorValidationError
from worker.app.shared.schemas.prediction import PredictionResponse, PredictionMetadata


class PredictionOrchestrator:
    def __init__(self, registry: dict[str, Any]) -> None:
        self.registry = registry

    def load_all(self) -> None:
        """Eagerly load all models. Optional since models should lazy load on predict."""
        for predictor in self.registry.values():
            predictor.load_model()

    def predict(self, input_data: str, predictors: list[str] | None = None) -> PredictionResponse:
        """
        Run predictors and merge their results into a single PredictionResponse.
        If `predictors` is None, runs a default set (e.g. all or just 'band_gap').
        
        Gracefully handles predictor failures:
        - Successful predictors still return results
        - Failed predictors are reported in metadata.failed_predictors
        - Only raises if ALL predictors fail or predictor is unknown
        """
        if predictors is None:
            predictors = ["band_gap"]

        start_time = time.perf_counter()
        properties = {}
        model_versions = {}
        failed_predictors = {}
        predictors_used = []
        validation_error: PredictorValidationError | None = None

        for p_name in predictors:
            if p_name not in self.registry:
                raise ValueError(f"Unknown predictor: {p_name}")

            predictor = self.registry[p_name]
            
            try:
                result = predictor.predict(input_data)
                properties[p_name] = result
                predictors_used.append(p_name)
                
                # Extract version from metadata
                p_metadata = predictor.get_metadata()
                model_versions[p_name] = p_metadata.get("version", "unknown")
                
            except PredictorValidationError as exc:
                if validation_error is None:
                    validation_error = exc
                failed_predictors[p_name] = str(exc)
            except Exception as exc:
                # Record failure but continue with other predictors.
                error_msg = str(exc) if str(exc) else type(exc).__name__
                failed_predictors[p_name] = error_msg

        # Raise only if no predictors succeeded.
        if not properties:
            if validation_error is not None:
                raise validation_error
            failed_msgs = "; ".join(f"{k}: {v}" for k, v in failed_predictors.items())
            raise RuntimeError(f"All predictors failed: {failed_msgs}")

        # Calculate inference time
        end_time = time.perf_counter()
        inference_time_ms = (end_time - start_time) * 1000

        # Build metadata
        metadata = PredictionMetadata(
            inference_time_ms=inference_time_ms,
            predictors_used=predictors_used,
            model_versions=model_versions,
            generated_at=datetime.utcnow().isoformat(),
            failed_predictors=failed_predictors
        )

        return PredictionResponse(properties=properties, metadata=metadata)
