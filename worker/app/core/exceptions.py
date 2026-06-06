class ModelNotFoundError(ValueError):
    """Raised when a requested model is not registered."""


class ModelUnavailableError(RuntimeError):
    """Raised when a registered model cannot serve predictions."""


class PredictionError(RuntimeError):
    """Raised when inference fails after request validation."""


class PredictorLoadError(RuntimeError):
    """Raised when a predictor model fails to load."""


class PredictorInferenceError(RuntimeError):
    """Raised when inference fails during prediction."""


class PredictorValidationError(ValueError):
    """Raised when input validation fails."""
