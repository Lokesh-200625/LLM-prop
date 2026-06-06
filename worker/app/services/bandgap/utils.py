from __future__ import annotations

import math


def finite_prediction(value: float) -> float:
    if not math.isfinite(value):
        raise RuntimeError("Model returned a non-finite prediction.")
    return round(value, 4)
