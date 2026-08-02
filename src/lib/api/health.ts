import { apiFetch } from "../api-client";
import type { HealthResponse } from "../types/health";

export const healthApi = {
  check: () => apiFetch<HealthResponse>("/health", { auth: false }),
};
