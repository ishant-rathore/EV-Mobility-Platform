const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let message = `API request failed with status ${response.status}`;
    try {
      const payload = (await response.json()) as { error?: { message?: unknown } };
      if (typeof payload.error?.message === "string") message = payload.error.message;
    } catch {
      // Keep the status-based fallback when the server did not return JSON.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
