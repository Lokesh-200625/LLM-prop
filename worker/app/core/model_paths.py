import os
from pathlib import Path

BASE_MODEL_DIR = Path(os.getenv("MODEL_DIR", Path(__file__).resolve().parents[2] / "models"))

MODEL_PATHS = {
    "band_gap": BASE_MODEL_DIR / "band_gap" / "best_bandgap_model.pt",
}

TOKENIZER_PATHS = {
    "band_gap": BASE_MODEL_DIR / "band_gap" / "tokenizer",
}
