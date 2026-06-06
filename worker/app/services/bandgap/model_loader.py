from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import torch
import torch.nn as nn
from transformers import AutoConfig, AutoModel

from worker.app.services.bandgap.tokenizer import load_tokenizer

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class ModelBundle:
    model: nn.Module
    tokenizer: Any
    device: torch.device
    max_length: int


class BandGapModel(nn.Module):
    def __init__(self, config: Any) -> None:
        super().__init__()
        self.backbone = AutoModel.from_config(config)
        hidden = config.hidden_size
        self.dropout = nn.Dropout(0.1)
        self.regressor = nn.Sequential(
            nn.Linear(hidden, 256),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(256, 1),
        )

    @staticmethod
    def _mean_pool(last_hidden_state: torch.Tensor, attention_mask: torch.Tensor) -> torch.Tensor:
        mask = attention_mask.unsqueeze(-1).expand(last_hidden_state.size()).float()
        summed = torch.sum(last_hidden_state * mask, dim=1)
        counts = torch.clamp(mask.sum(dim=1), min=1e-9)
        return summed / counts

    def forward(
        self,
        input_ids: torch.Tensor,
        attention_mask: torch.Tensor | None = None,
        **kwargs: Any,
    ) -> torch.Tensor:
        out = self.backbone(input_ids=input_ids, attention_mask=attention_mask)
        pooled = self._mean_pool(out.last_hidden_state, attention_mask)
        pooled = self.dropout(pooled)
        pred = self.regressor(pooled)
        return pred.squeeze(-1)


def load_model_bundle(
    model_file: Path,
    tokenizer_dir: Path | None,
    max_length: int = 256,
    device: str | None = None
) -> ModelBundle:

    if not model_file.exists():
        raise FileNotFoundError(f"Model weights not found: {model_file}")
    if tokenizer_dir is None:
        raise FileNotFoundError("Bandgap tokenizer directory is not configured.")

    resolved_device = torch.device(device or ("cuda" if torch.cuda.is_available() else "cpu"))

    logger.info("Loading bandgap tokenizer path=%s", tokenizer_dir)
    tokenizer = load_tokenizer(tokenizer_dir)

    logger.info("Loading bandgap weights path=%s", model_file)
    state_dict: dict[str, torch.Tensor] = torch.load(
        model_file,
        map_location="cpu",
        weights_only=False,
    )
    if not isinstance(state_dict, dict):
        raise RuntimeError("Unexpected checkpoint format: expected a state dict.")

    model_config = AutoConfig.from_pretrained(tokenizer_dir, local_files_only=True)
    model = BandGapModel(model_config)
    missing, unexpected = model.load_state_dict(state_dict, strict=False)
    if missing:
        logger.warning("Missing bandgap state dict keys keys=%s", missing)
    if unexpected:
        logger.warning("Unexpected bandgap state dict keys keys=%s", unexpected)

    model.to(resolved_device)
    model.eval()

    max_length_val = min(int(getattr(tokenizer, "model_max_length", max_length) or max_length), max_length)
    logger.info("Bandgap model ready device=%s max_length=%s", resolved_device, max_length_val)

    return ModelBundle(
        model=model,
        tokenizer=tokenizer,
        device=resolved_device,
        max_length=max_length_val,
    )
