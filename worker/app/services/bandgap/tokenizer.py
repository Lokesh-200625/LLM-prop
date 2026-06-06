from __future__ import annotations

from pathlib import Path
from typing import Any

from transformers import AutoTokenizer


def load_tokenizer(tokenizer_dir: Path) -> Any:
    if not tokenizer_dir.exists():
        raise FileNotFoundError(f"Tokenizer directory not found: {tokenizer_dir}")
    return AutoTokenizer.from_pretrained(tokenizer_dir, local_files_only=True, use_fast=True)
