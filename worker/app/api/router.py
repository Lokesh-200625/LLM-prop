from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, Request

from worker.app.api.routes import bandgap, health
from worker.app.api.schemas import PredictRequest, PredictResponse
from worker.app.core.exceptions import ModelNotFoundError, PredictorValidationError

logger = logging.getLogger(__name__)

router = APIRouter()
router.include_router(health.router)
router.include_router(bandgap.router)


@router.post("/predict", response_model=PredictResponse)
def predict(request: Request, payload: PredictRequest) -> PredictResponse:
    orchestrator = request.app.state.orchestrator

    try:
        # Use new model name mapping if it came from legacy
        if payload.model == "bandgap":
            predictor_names = list(orchestrator.registry.keys())
        else:
            predictor_names = [payload.model]
        result = orchestrator.predict(input_data=payload.input, predictors=predictor_names)
    except ValueError as exc:
        if "Unknown predictor" in str(exc):
            raise HTTPException(status_code=404, detail=str(exc)) from exc
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except PredictorValidationError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Unified prediction failed model=%s", payload.model)
        raise HTTPException(status_code=500, detail="Prediction failed.") from exc

    return PredictResponse(
        properties=result.properties,
        metadata=result.metadata,
    )
