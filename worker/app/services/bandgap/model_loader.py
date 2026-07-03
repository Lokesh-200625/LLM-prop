from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import onnxruntime as ort

from worker.app.services.bandgap.tokenizer import load_tokenizer

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class ModelBundle:
    model: ort.InferenceSession
    tokenizer: Any
    device: str
    max_length: int
    input_names: set[str]


def load_model_bundle(
    model_file: Path,
    tokenizer_dir: Path | None,
    max_length: int = 256,
    device: str | None = None
) -> ModelBundle:

    if not model_file.exists():
        raise FileNotFoundError(f"Model file not found: {model_file}")
    if tokenizer_dir is None:
        raise FileNotFoundError("Bandgap tokenizer directory is not configured.")

    requested_device = (device or "cpu").strip().lower()
    available_providers = set(ort.get_available_providers())
    providers: list[str]
    if requested_device == "cuda" and "CUDAExecutionProvider" in available_providers:
        providers = ["CUDAExecutionProvider", "CPUExecutionProvider"]
        resolved_device = "cuda"
    else:
        providers = ["CPUExecutionProvider"]
        resolved_device = "cpu"

    logger.info("Loading bandgap tokenizer path=%s", tokenizer_dir)
    tokenizer = load_tokenizer(tokenizer_dir)

    logger.info("Loading bandgap ONNX model path=%s providers=%s", model_file, providers)
    session = ort.InferenceSession(
        str(model_file),
        providers=providers,
    )

    max_length_val = min(int(getattr(tokenizer, "model_max_length", max_length) or max_length), max_length)
    input_names = {input_meta.name for input_meta in session.get_inputs()}
    logger.info("Bandgap model ready device=%s max_length=%s", resolved_device, max_length_val)

    return ModelBundle(
        model=session,
        tokenizer=tokenizer,
        device=resolved_device,
        max_length=max_length_val,
        input_names=input_names,
    )
