from __future__ import annotations

import os
from pathlib import Path
from threading import Lock

from huggingface_hub import snapshot_download

# ---------------------------------------------------------------------------
# Base directories
# ---------------------------------------------------------------------------

BASE_MODEL_DIR = Path(os.getenv("MODEL_DIR", str(Path(__file__).resolve().parents[2] / "models")))
HF_CACHE_DIR = Path(os.getenv("HF_CACHE_DIR", str(BASE_MODEL_DIR / ".hf-cache")))

# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

_bandgap_root_cache: Path | None = None
_bandgap_root_lock = Lock()


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


def _resolve_bandgap_root() -> Path:
    """
    Resolve the directory that contains the band-gap ONNX model and tokenizer.

    Resolution order:
    1. If BANDGAP_HF_REPO_ID is set → download / reuse HF snapshot.
    2. Otherwise → use the local ``worker/models/band_gap`` directory.

    This function is called lazily on first access and the result is cached
    in-process so the download happens at most once per worker boot.
    """
    repo_id = os.getenv("BANDGAP_HF_REPO_ID")
    if repo_id:
        revision = os.getenv("BANDGAP_HF_REVISION", "main")
        return _resolve_hf_snapshot(repo_id, revision)
    return BASE_MODEL_DIR / "band_gap"


def _get_bandgap_root() -> Path:
    """Thread-safe lazy initialiser for the band-gap model root directory."""
    global _bandgap_root_cache
    if _bandgap_root_cache is not None:
        return _bandgap_root_cache
    with _bandgap_root_lock:
        if _bandgap_root_cache is None:
            _bandgap_root_cache = _resolve_bandgap_root()
    return _bandgap_root_cache


# ---------------------------------------------------------------------------
# Public path accessors
# These are callables so that resolution is deferred until first use, which
# means the FastAPI app can start up even when the network is unavailable.
# ---------------------------------------------------------------------------

def _model_path(name: str) -> Path:
    if name == "band_gap":
        return _get_bandgap_root() / os.getenv("BANDGAP_HF_MODEL_FILENAME", "bandgapquantized.onnx")
    raise KeyError(f"Unknown model: {name}")


def _tokenizer_path(name: str) -> Path:
    if name == "band_gap":
        return _get_bandgap_root() / os.getenv("BANDGAP_HF_TOKENIZER_DIRNAME", "tokenizer")
    raise KeyError(f"Unknown model: {name}")


class _LazyPathMap:
    """Dict-like accessor that resolves paths on first access, not at import time."""

    def __init__(self, resolver) -> None:
        self._resolver = resolver

    def __getitem__(self, key: str) -> Path:
        return self._resolver(key)


MODEL_PATHS: _LazyPathMap = _LazyPathMap(_model_path)
TOKENIZER_PATHS: _LazyPathMap = _LazyPathMap(_tokenizer_path)
