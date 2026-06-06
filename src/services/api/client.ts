async function parseJson<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as unknown;

  if (!response.ok) {
    const message =
      payload && typeof payload === "object"
        ? "error" in payload && typeof payload.error === "string"
          ? payload.error
          : "detail" in payload && typeof payload.detail === "string"
            ? payload.detail
            : undefined
        : undefined;
    throw new Error(message ?? `Request failed with status ${response.status}.`);
  }

  return payload as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  return parseJson<T>(response);
}

export async function apiPost<TResponse, TBody>(path: string, body: TBody): Promise<TResponse> {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    return parseJson<TResponse>(response);
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : error && typeof error === "object" && "message" in error
      ? String((error as { message?: string }).message)
      : String(error);
    throw new Error(message || "Network request failed.");
  }
}

export async function apiDelete<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });
  return parseJson<T>(response);
}
