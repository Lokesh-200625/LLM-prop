from __future__ import annotations


def validate_non_empty_text(text: str) -> str:
    cleaned = text.strip()
    if not cleaned:
        raise ValueError("Text input cannot be empty.")
    return cleaned
