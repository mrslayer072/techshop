/**
 * Thin HTTP client for the techshop-api backend.
 *
 * Responsibilities:
 *   - Prefix every request with the configured base URL.
 *   - Attach the bearer token when we have one.
 *   - Transparently refresh on 401 and retry the original request once.
 *   - Unwrap the `{ data, pagination?, error }` envelope the backend always
 *     returns so callers work with plain domain types.
 *
 * This file is deliberately framework-agnostic — no React here. The
 * AuthContext calls into it and drives the token lifecycle.
 */
import { storage, type StoredAuth } from "./authStorage";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:4000/api";

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
  status: number;
}

export class ApiRequestError extends Error implements ApiError {
  code: string;
  details?: unknown;
  status: number;
  constructor(apiError: ApiError) {
    super(apiError.message);
    this.name = "ApiRequestError";
    this.code = apiError.code;
    this.details = apiError.details;
    this.status = apiError.status;
  }
}

interface ApiEnvelope<T> {
  data?: T;
  pagination?: unknown;
  error?: { message: string; code: string; details?: unknown };
}

type RequestInitWithJson = Omit<RequestInit, "body"> & { json?: unknown };

/**
 * Single in-flight refresh promise — if ten requests all 401 at once we
 * only want one refresh call to run, and the others should wait for it.
 */
let refreshInFlight: Promise<StoredAuth | null> | null = null;

async function doRefresh(): Promise<StoredAuth | null> {
  const auth = storage.get();
  if (!auth?.refreshToken) return null;

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: auth.refreshToken }),
  });
  if (!res.ok) return null;
  const body = (await res.json()) as ApiEnvelope<{
    user: StoredAuth["user"];
    accessToken: string;
    refreshToken: string;
  }>;
  if (!body.data) return null;

  const next: StoredAuth = {
    user: body.data.user,
    accessToken: body.data.accessToken,
    refreshToken: body.data.refreshToken,
  };
  storage.set(next);
  return next;
}

async function refreshTokens(): Promise<StoredAuth | null> {
  if (!refreshInFlight) {
    refreshInFlight = doRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function request<T>(
  path: string,
  init: RequestInitWithJson = {},
  retry = true,
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const auth = storage.get();
  if (auth?.accessToken) {
    headers.set("Authorization", `Bearer ${auth.accessToken}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
    body:
      init.json !== undefined
        ? JSON.stringify(init.json)
        : (init.body as BodyInit | null | undefined),
  });

  // 401 with a still-valid refresh token → try once to recover silently.
  if (res.status === 401 && retry && auth?.refreshToken) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      return request<T>(path, init, false);
    }
    // Refresh failed — clear stale tokens so the UI can route to /login.
    storage.clear();
  }

  // 204 No Content — nothing to parse.
  if (res.status === 204) return undefined as T;

  let body: ApiEnvelope<T> | null = null;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    body = null;
  }

  if (!res.ok) {
    const err: ApiError = body?.error
      ? { ...body.error, status: res.status }
      : { message: res.statusText, code: "HTTP_ERROR", status: res.status };
    throw new ApiRequestError(err);
  }

  // Backend always wraps successful payloads in `data`. If it's missing,
  // we still return whatever came back so callers don't hard-fail.
  return (body?.data ?? (body as unknown)) as T;
}

export const apiClient = {
  get: <T>(path: string, init?: RequestInitWithJson) =>
    request<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, json?: unknown, init?: RequestInitWithJson) =>
    request<T>(path, { ...init, method: "POST", json }),
  patch: <T>(path: string, json?: unknown, init?: RequestInitWithJson) =>
    request<T>(path, { ...init, method: "PATCH", json }),
  delete: <T>(path: string, init?: RequestInitWithJson) =>
    request<T>(path, { ...init, method: "DELETE" }),
};

export { BASE_URL as API_BASE_URL };
