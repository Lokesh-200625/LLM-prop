import os
from pathlib import Path

from huggingface_hub import snapshot_download

BASE_MODEL_DIR = Path(os.getenv("MODEL_DIR", Path(__file__).resolve().parents[2] / "models"))
HF_CACHE_DIR = Path(os.getenv("HF_CACHE_DIR", BASE_MODEL_DIR / ".hf-cache"))


def _repo_cache_dir(repo_id: str, revision: str) -> Path:
    safe_repo_id = repo_id.replace("/", "__")
    return HF_CACHE_DIR / safe_repo_id / revision


def _resolve_hf_snapshot(repo_id: str, revision: str) -> Path:
    snapshot_dir = _repo_cache_dir(repo_id, revision)
    if snapshot_dir.exists() and any(snapshot_dir.iterdir()):
        return snapshot_dir

    snapshot_dir.parent.mkdir(parents=True, exist_ok=True)
    return Path(
        snapshot_download(
            repo_id=repo_id,
            revision=revision,
            local_dir=snapshot_dir,
            local_dir_use_symlinks=False,
        )
    )


def _bandgap_root() -> Path:
    repo_id = os.getenv("BANDGAP_HF_REPO_ID")
    if repo_id:
        revision = os.getenv("BANDGAP_HF_REVISION", "main")
        return _resolve_hf_snapshot(repo_id, revision)
    return BASE_MODEL_DIR / "band_gap"


_BANDGAP_ROOT = _bandgap_root()

MODEL_PATHS = {
    "band_gap": _BANDGAP_ROOT / os.getenv("BANDGAP_HF_MODEL_FILENAME", "bandgapquantized.onnx"),
}

TOKENIZER_PATHS = {
    "band_gap": _BANDGAP_ROOT / os.getenv("BANDGAP_HF_TOKENIZER_DIRNAME", "tokenizer"),
}
