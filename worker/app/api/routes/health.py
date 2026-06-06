from __future__ import annotations

from fastapi import APIRouter, Request

from worker.app.api.schemas import HealthResponse
from worker.app.registry import ModelRegistry

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def health(request: Request) -> HealthResponse:
    registry: ModelRegistry = request.app.state.registry
    models = registry.status()
    status = "ok" if all(model.get("ready") for model in models.values()) else "degraded"
    return HealthResponse(status=status, models=models)


@router.get("/models/status")
def model_status(request: Request) -> dict:
    registry: ModelRegistry = request.app.state.registry
    return {"models": registry.status()}


@router.get("/health/models")
def health_models(request: Request) -> dict:
    """
    Enhanced health endpoint for model/predictor status.
    
    Returns detailed metadata about each predictor including:
    - loaded: whether model is in memory
    - ready: whether model is ready to serve predictions
    - version: model version identifier
    """
    orchestrator = request.app.state.orchestrator
    models_health = {}
    
    for name, predictor in orchestrator.registry.items():
        metadata = predictor.get_metadata()
        models_health[name] = {
            "loaded": metadata.get("ready", False),
            "ready": metadata.get("ready", False),
            "version": metadata.get("version", "unknown"),
            "device": metadata.get("device", "unknown"),
        }
    
    return models_health
