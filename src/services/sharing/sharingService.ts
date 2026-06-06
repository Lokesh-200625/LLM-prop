export type SharePayload = {
  predictionId: string;
  title: string;
};

import { apiDelete, apiPost } from "@/services/api/client";

export type ShareResponse = {
  slug: string;
  url: string;
  title: string;
};

export async function createShare(payload: SharePayload): Promise<ShareResponse> {
  return apiPost<ShareResponse, SharePayload>("/api/share", payload);
}

export async function deleteShare(slug: string): Promise<void> {
  await apiDelete<{ ok: true }>(`/api/share/${slug}`);
}
