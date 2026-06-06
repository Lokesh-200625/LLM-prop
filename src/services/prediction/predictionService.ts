import { apiPost } from "@/services/api/client";
import type { BandGapPrediction, PredictionResponse } from "@/types/prediction";

export async function predictBandGap(text: string): Promise<BandGapPrediction> {
  const payload = await apiPost<PredictionResponse, { model: "bandgap"; input: string }>(
    "/api/predict",
    {
      model: "bandgap",
      input: text,
    },
  );

  return {
    prediction: payload.output.band_gap_ev,
    unit: "eV",
    id: payload.predictionId,
    confidence: payload.output.confidence,
    properties: payload.output.properties,
  };
}


