import { apiFetch } from "../api-client";
import type {
  LoginRequest,
  SignupRequest,
  SignupResponse,
  TokenResponse,
  UserInfo,
} from "../types/auth";

export const authApi = {
  signup: (body: SignupRequest) =>
    apiFetch<SignupResponse>("/auth/signup", { method: "POST", body, auth: false }),

  login: (body: LoginRequest) =>
    apiFetch<TokenResponse>("/auth/login", { method: "POST", body, auth: false }),

  refresh: (refresh_token: string) =>
    apiFetch<TokenResponse>("/auth/refresh", {
      method: "POST",
      body: { refresh_token },
      auth: false,
    }),

  logout: () => apiFetch<void>("/auth/logout", { method: "POST" }),

  me: () => apiFetch<UserInfo>("/auth/me"),
};
