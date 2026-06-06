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
    return Path("./worker/models/band_gap")


MODEL_DIR = _get_model_dir()


def ensure_model() -> None:
    """
    Download model from Hugging Face if it does not exist.
    Safe to call multiple times.
    """

    model_file = MODEL_DIR / "best_bandgap_model.pt"

    if model_file.exists():
        logger.info("Model already available at %s", MODEL_DIR)
        return

    logger.info("Model not found. Downloading to %s", MODEL_DIR)

    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    try:
        snapshot_download(
            repo_id="ZahidHussain-1007/llm-prop-bandgap-model",
            local_dir=str(MODEL_DIR),
            token=os.getenv("HF_TOKEN"),
            local_dir_use_symlinks=False,
        )

        logger.info("Model download completed successfully")

    except Exception as exc:
        logger.exception("Model download failed")
        raise RuntimeError(
            f"Failed to download model from Hugging Face: {exc}"
        ) from exc