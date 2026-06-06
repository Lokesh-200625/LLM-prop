export type ModelName = "bandgap";

export type PropertyPredictionData = {
  value: number | string;
  unit?: string;
  confidence?: number;
};

export type PredictionOutput = {
  label: string;
  band_gap_ev: number; // Legacy
  confidence: number;
  source: "fastapi";
  properties?: Record<string, PropertyPredictionData>; // New
};

export type PredictionResponse = {
  output: PredictionOutput;
  predictionId?: string | null;
};

export type BandGapPrediction = {
  prediction: number;
  unit: string;
  id?: string | null;
  confidence?: number;
  model?: ModelName;
  properties?: Record<string, PropertyPredictionData>;
};

export type HistoryItem = {
  id: string;
  input_text: string;
  output: {
    label?: string;
    band_gap_ev: number;
    confidence?: number;
    source?: string;
    properties?: Record<string, PropertyPredictionData>;
  };
  created_at: string;
  shared_count?: number;
};

export type HistoryResponse = {
  history: HistoryItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
};
