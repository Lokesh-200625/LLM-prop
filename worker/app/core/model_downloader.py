from pathlib import Path
from huggingface_hub import snapshot_download
import os
import logging

logger = logging.getLogger(__name__)

# Get model cache directory from environment or use safe default
# Priority: MODEL_CACHE_DIR env var > HF default cache > local fallback
def _get_model_dir() -> Path:
    # Check environment variable first
    env_cache = os.getenv("MODEL_CACHE_DIR")
    if env_cache:
        return Path(env_cache) / "band_gap"
    
    # Use HuggingFace default cache (works across platforms)
    # ~/.cache/huggingface/hub on Linux/Mac, %USERPROFILE%\.cache\huggingface\hub on Windows
    # In Docker/Render, this defaults to /root/.cache/huggingface/hub
    hf_cache = os.getenv("HF_HOME")
    if hf_cache:
        return Path(hf_cache) / "models"
    
    # Fallback: use local directory if available (development)
    local_models = Path(__file__).resolve().parents[2] / "models" / "band_gap"
    if local_models.parent.exists():
        return local_models
    
    # Last resort: use HF default
    from huggingface_hub import HF_HOME as HF_HOME_DEFAULT
    return Path(HF_HOME_DEFAULT) / "models" / "band_gap"

MODEL_DIR = _get_model_dir()

def ensure_model():
    """Download model from Hugging Face if not already cached."""
    if MODEL_DIR.exists():
        logger.info(f"Model found at {MODEL_DIR}")
        return
    
    logger.info(f"Model not found, downloading to {MODEL_DIR}...")
    try:
        snapshot_download(
            repo_id="ZahidHussain-1007/llm-prop-bandgap-model",
            local_dir=str(MODEL_DIR),
            token=os.getenv("HF_TOKEN"),
            cache_dir=str(MODEL_DIR.parent),
        )
        logger.info(f"Model successfully downloaded to {MODEL_DIR}")
    except Exception as e:
        logger.error(f"Failed to download model: {e}")
        raise RuntimeError(f"Model download failed: {e}") from e