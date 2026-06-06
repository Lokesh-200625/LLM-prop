from worker.app.services.bandgap.predictor import BandGapService
from worker.app.core.model_paths import MODEL_PATHS, TOKENIZER_PATHS

PREDICTOR_REGISTRY = {
    "band_gap": BandGapService(),
}
