from __future__ import annotations

import sys
from pathlib import Path

import uvicorn

from worker.app.core.config import get_settings

PROJECT_ROOT = Path(__file__).resolve().parent.parent


def _ensure_project_root_on_path() -> None:
    project_root_str = str(PROJECT_ROOT)
    if project_root_str not in sys.path:
        sys.path.insert(0, project_root_str)


if __name__ == "__main__":
    _ensure_project_root_on_path()
    settings = get_settings()
    uvicorn.run("worker.app.main:app", host=settings.host, port=settings.port, reload=False)
