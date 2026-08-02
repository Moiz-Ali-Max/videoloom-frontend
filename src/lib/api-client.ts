import { API_BASE_URL } from "./config";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  notifyAuthExpired,
  setTokens,
} from "./token-storage";
import type { TokenResponse } from "./types/auth";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  /** Plain object → JSON-encoded. FormData → set isForm to send as-is. */
  body?: unknown;
  /** Attach the Bearer token. Defaults to true — set false for signup/login/refresh. */
  auth?: boolean;
  /** Body is already a FormData instance (multipart upload). */
  isForm?: boolean;
}

// Concurrent 401s share a single in-flight refresh call instead of each racing Supabase.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh_token = getRefreshToken();
  if (!refresh_token) return null;

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data: TokenResponse = await res.json();
        setTokens(data.access_token, data.refresh_token);
        return data.access_token;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data?.detail === "string") return data.detail;
    if (Array.isArray(data?.detail)) {
      // FastAPI 422 validation errors: [{ loc, msg, type }]
      return data.detail
        .map((d: { msg?: string }) => d.msg)
        .filter(Boolean)
        .join(", ");
    }
  } catch {
    // response wasn't JSON — fall through to statusText
  }
  return res.statusText || "Request failed";
}

function buildHeaders(
  headersInit: HeadersInit | undefined,
  token: string | null,
  auth: boolean,
  hasJsonBody: boolean,
): Headers {
  const headers = new Headers(headersInit);
  if (hasJsonBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (auth && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, isForm = false, headers, ...rest } = options;
  const hasJsonBody = !isForm && body !== undefined;

  const requestBody: BodyInit | undefined = isForm
    ? (body as FormData)
    : hasJsonBody
      ? JSON.stringify(body)
      : undefined;

  const doFetch = (token: string | null) =>
    fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: buildHeaders(headers, token, auth, hasJsonBody),
      body: requestBody,
    });

  let res = await doFetch(auth ? getAccessToken() : null);

  if (res.status === 401 && auth) {
    const newToken = getRefreshToken() ? await refreshAccessToken() : null;
    if (newToken) {
      res = await doFetch(newToken);
    } else {
      clearTokens();
      notifyAuthExpired();
      throw new ApiError(401, "Your session has expired. Please log in again.");
    }
  }

  if (res.status === 429) {
    throw new ApiError(429, "You're doing that too fast — please wait a moment and try again.");
  }

  if (!res.ok) {
    const message = await parseErrorMessage(res);
    if (res.status === 401) {
      clearTokens();
      notifyAuthExpired();
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  return undefined as T;
}

type BlobRequestOptions = Omit<RequestOptions, "body" | "isForm">;

/** For file-download endpoints (subtitle exports) that return raw bytes, not JSON. */
export async function apiFetchBlob(
  path: string,
  options: BlobRequestOptions = {},
): Promise<{ blob: Blob; filename: string | null }> {
  const { auth = true, headers, ...rest } = options;

  const doFetch = (token: string | null) =>
    fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: buildHeaders(headers, token, auth, false),
    });

  let res = await doFetch(auth ? getAccessToken() : null);

  if (res.status === 401 && auth) {
    const newToken = getRefreshToken() ? await refreshAccessToken() : null;
    if (newToken) {
      res = await doFetch(newToken);
    } else {
      clearTokens();
      notifyAuthExpired();
      throw new ApiError(401, "Your session has expired. Please log in again.");
    }
  }

  if (!res.ok) {
    const message = await parseErrorMessage(res);
    throw new ApiError(res.status, message);
  }

  const disposition = res.headers.get("content-disposition");
  const match = disposition?.match(/filename="?([^"]+)"?/i);
  const filename = match?.[1] ?? null;
  const blob = await res.blob();
  return { blob, filename };
}

/** Saves a Blob to the user's disk via a throwaway anchor + object URL. */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
