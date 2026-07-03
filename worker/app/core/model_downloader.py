from pathlib import Path
import os
import logging

from huggingface_hub import snapshot_download

logger = logging.getLogger(__name__)


def _get_model_dir() -> Path:
    """
    Resolve model storage location.

    Priority:
    1. MODEL_CACHE_DIR environment variable
    2. HF_HOME environment variable
    3. Local development fallback
    """

    model_cache_dir = os.getenv("MODEL_CACHE_DIR")
    if model_cache_dir:
        return Path(model_cache_dir)

    hf_home = os.getenv("HF_HOME")
    if hf_home:
        return Path(hf_home) / "band_gap"

    # Local development fallback
    return Path(__file__).resolve().parents[3] / "models" / "band_gap"


MODEL_DIR = _get_model_dir()

_ONNX_FILENAME = os.getenv("BANDGAP_HF_MODEL_FILENAME", "bandgapquantized.onnx")


def ensure_model() -> None:
    """
    Download model from Hugging Face if the ONNX model file does not exist locally.

    The target repo is read from the BANDGAP_HF_REPO_ID environment variable.
    If BANDGAP_HF_REPO_ID is not set this function is a no-op — the worker will
    rely on the pre-baked local model files instead.

    Safe to call multiple times.
    """

    repo_id = os.getenv("BANDGAP_HF_REPO_ID")
    if not repo_id:
        logger.info(
            "BANDGAP_HF_REPO_ID is not set — skipping Hugging Face download. "
            "Expecting local ONNX model at %s",
            MODEL_DIR / _ONNX_FILENAME,
        )
        return

    model_file = MODEL_DIR / _ONNX_FILENAME

    if model_file.exists():
        logger.info("ONNX model already available at %s", model_file)
        return

    revision = os.getenv("BANDGAP_HF_REVISION", "main")
    logger.info(
        "ONNX model not found. Downloading repo=%s revision=%s to %s",
        repo_id,
        revision,
        MODEL_DIR,
    )

    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    try:
        snapshot_download(
            repo_id=repo_id,
            revision=revision,
            local_dir=str(MODEL_DIR),
            token=os.getenv("HF_TOKEN"),
            local_dir_use_symlinks=False,
        )

        logger.info("Model download completed successfully")

    except Exception as exc:
        logger.exception("Model download failed")
        raise RuntimeError(
            f"Failed to download model from Hugging Face (repo={repo_id}): {exc}"
        ) from exc