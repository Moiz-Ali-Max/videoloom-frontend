const ACCESS_KEY = "videoloom.access_token";
const REFRESH_KEY = "videoloom.refresh_token";

export const AUTH_EXPIRED_EVENT = "videoloom:auth-expired";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_KEY, accessToken);
  window.localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
}

export function hasRefreshToken(): boolean {
  return getRefreshToken() !== null;
}

/** Notifies the AuthProvider that the session is no longer valid so it can redirect to /login. */
export function notifyAuthExpired(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
}
