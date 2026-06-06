from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel, Field


PROJECT_ROOT = Path(__file__).resolve().parents[3]
WORKER_ROOT = PROJECT_ROOT / "worker"


def _csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


class ModelConfig(BaseModel):
    name: str
    model_path: Path
    tokenizer_dir: Path | None = None
    max_length: int = 256
    batch_size: int = 16


class Settings(BaseModel):
    app_name: str = "LLM-Prop Model Worker"
    api_version: str = "2.0.0"
    log_level: str = Field(default_factory=lambda: os.getenv("LOG_LEVEL", "INFO").upper())
    host: str = Field(default_factory=lambda: os.getenv("WORKER_HOST", "127.0.0.1"))
    port: int = Field(default_factory=lambda: int(os.getenv("WORKER_PORT", "8000")))
    device: str | None = Field(default_factory=lambda: os.getenv("MODEL_DEVICE"))
    cors_origins: list[str] = Field(
        default_factory=lambda: _csv(
            os.getenv(
                "CORS_ORIGINS",
                "http://localhost:3000,http://127.0.0.1:3000",
            )
        )
    )
    max_text_length: int = Field(default_factory=lambda: int(os.getenv("MAX_TEXT_LENGTH", "5000")))

    bandgap: ModelConfig = Field(
        default_factory=lambda: ModelConfig(
            name="bandgap",
            model_path=Path(
                os.getenv(
                    "BANDGAP_MODEL_PATH",
                    str(WORKER_ROOT / "models" / "band_gap" / "best_bandgap_model.pt"),
                )
            ),
            tokenizer_dir=Path(
                os.getenv(
                    "BANDGAP_TOKENIZER_DIR",
                    str(WORKER_ROOT / "models" / "band_gap" / "tokenizer"),
                )
            ),
            max_length=int(os.getenv("BANDGAP_MAX_LENGTH", "256")),
            batch_size=int(os.getenv("BANDGAP_BATCH_SIZE", "16")),
        )
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
