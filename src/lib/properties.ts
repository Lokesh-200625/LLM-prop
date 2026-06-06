export const PROPERTY_LABELS: Record<string, string> = {
  band_gap: "Band Gap",
};

export function getPropertyLabel(key: string): string {
  return PROPERTY_LABELS[key] || key;
}
