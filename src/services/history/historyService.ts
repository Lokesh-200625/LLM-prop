import { apiGet } from "@/services/api/client";
import { apiDelete } from "@/services/api/client";
import type { HistoryResponse } from "@/types/prediction";

export async function getPredictionHistory(params?: {
  q?: string;
  page?: number;
  limit?: number;
}): Promise<HistoryResponse> {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));

  return apiGet<HistoryResponse>(`/api/history${search.size ? `?${search}` : ""}`);
}

export async function deletePrediction(id: string): Promise<void> {
  await apiDelete<{ ok: true }>(`/api/history/${id}`);
}
