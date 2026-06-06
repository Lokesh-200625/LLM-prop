"use client";

import { Clock, Database, Sparkles } from "lucide-react";

import { SharePredictionButton } from "@/components/SharePredictionButton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getPropertyLabel } from "@/lib/properties";

type PredictionProperties = Record<
  string,
  { value: number | string; unit?: string; confidence?: number }
>;

type PredictionResultCardProps = {
  predictionId?: string | null;
  materialInput: string;
  timestamp?: Date | string;
  explanation?: string;
  saved?: boolean;
  properties: PredictionProperties;
};

function category(value: number) {
  if (value <= 0.01) return "Metal / Semimetal";
  if (value < 2) return "Semiconductor";
  if (value < 4) return "Wide-gap semiconductor";
  return "Insulator";
}

export function PredictionResultCard({
  predictionId,
  materialInput,
  timestamp = new Date(),
  explanation,
  saved = Boolean(predictionId),
  properties,
}: PredictionResultCardProps) {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

  return (
    <Card className="border-border bg-card p-6 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge
            variant={saved ? "secondary" : "outline"}
            className="gap-1.5 bg-muted text-foreground hover:bg-accent border-0"
          >
            <Database className="size-3.5" />
            {saved ? "Saved" : "Unsaved"}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            {date.toLocaleString()}
          </div>
        </div>
        <SharePredictionButton predictionId={predictionId} title={materialInput.slice(0, 80)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(properties).map(([key, data]) => {
          const displayLabel = getPropertyLabel(key).toUpperCase();
          const displayValue = typeof data.value === "number" ? data.value.toFixed(4) : data.value;
          const categoryText =
            key === "band_gap" && typeof data.value === "number" ? category(data.value) : undefined;

          return (
            <div key={key} className="flex flex-col border border-white/5 bg-card p-5 rounded-xl min-h-[140px]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-yellow-500 uppercase">
                  <Sparkles className="size-3.5" />
                  {displayLabel}
                </div>
                {categoryText ? (
                  <Badge
                    variant="outline"
                    className="text-yellow-500 border-yellow-500/30 bg-transparent text-[10px] py-1 px-3 rounded-full font-medium"
                  >
                    {categoryText}
                  </Badge>
                ) : null}
              </div>

              <div className="mt-auto pt-6">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight text-foreground">
                    {displayValue}
                  </span>
                  {data.unit ? (
                    <span className="text-sm font-medium text-muted-foreground">{data.unit}</span>
                  ) : null}
                </div>

                {typeof data.confidence === "number" ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Confidence {(data.confidence * 100).toFixed(0)}%
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {explanation ? (
        <p className="mt-6 rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
          {explanation}
        </p>
      ) : null}
    </Card>
  );
}
