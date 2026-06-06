from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, Request

from worker.app.registry import ModelRegistry
from worker.app.services.bandgap.schema import (
    BandGapRequest,
    BandGapResponse,
    BatchBandGapItem,
    BatchBandGapRequest,
    BatchBandGapResponse,
)

logger = logging.getLogger(__name__)
router = APIRouter(tags=["bandgap"])


@router.post("/predict-bandgap", response_model=BandGapResponse)
def predict_bandgap(request: Request, payload: BandGapRequest) -> BandGapResponse:
    orchestrator = request.app.state.orchestrator

    try:
        result = orchestrator.predict(input_data=payload.text, predictors=["band_gap"])
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Bandgap prediction failed")
        raise HTTPException(status_code=500, detail="Prediction failed.") from exc

    return BandGapResponse(
        properties=result.properties,
        metadata=result.metadata
    )

@router.post("/batch-predict", response_model=BatchBandGapResponse)
def batch_predict(request: Request, payload: BatchBandGapRequest) -> BatchBandGapResponse:
    orchestrator = request.app.state.orchestrator
    results: list[BatchBandGapItem] = []
    succeeded = 0
    failed = 0

    for index, text in enumerate(payload.texts):
        try:
            result = orchestrator.predict(input_data=text, predictors=["band_gap"])
            prediction = result.properties["band_gap"].value
            results.append(BatchBandGapItem(index=index, text=text, prediction=prediction))
            succeeded += 1
        except Exception as exc:
            logger.warning("Batch bandgap item failed index=%s error=%s", index, exc)
            results.append(BatchBandGapItem(index=index, text=text, error=str(exc)))
            failed += 1

    return BatchBandGapResponse(
        results=results,
        total=len(payload.texts),
        succeeded=succeeded,
        failed=failed,
    )
