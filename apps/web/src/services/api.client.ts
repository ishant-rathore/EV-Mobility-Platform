const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";
const AUTH_TOKEN_KEY = "ev-mobility.operator-token";

export interface ApiEnvelope<T> {
  success: true;
  data: T;
  meta?: { page?: number; limit?: number; total?: number };
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export function getAuthToken(): string | null {
  return typeof window === "undefined" ? null : window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  else window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let message = `API request failed with status ${response.status}`;
    try {
      const payload = (await response.json()) as { error?: { message?: unknown } | string };
      if (typeof payload.error === "string") message = payload.error;
      else if (typeof payload.error?.message === "string") message = payload.error.message;
    } catch {
      // Keep the status-based fallback when the server did not return JSON.
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export async function apiDataRequest<T>(path: string, init?: RequestInit) {
  return apiRequest<ApiEnvelope<T>>(path, init);
}
