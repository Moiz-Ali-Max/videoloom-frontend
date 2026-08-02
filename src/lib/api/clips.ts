import { apiFetch } from "../api-client";
import type {
  ClipJobListResponse,
  ClipJobResponse,
  ClipRequest,
  ClipStatusResponse,
  ClipUpdateRequest,
} from "../types/clips";
import { ListJobsParams, toQuery } from "./shared";

export const clipsApi = {
  create: (body: ClipRequest) => apiFetch<ClipJobResponse>("/clips/", { method: "POST", body }),

  list: (params: ListJobsParams = {}) => apiFetch<ClipJobListResponse>(`/clips/jobs/${toQuery(params)}`),

  get: (clipJobId: string) => apiFetch<ClipStatusResponse>(`/clips/jobs/${clipJobId}`),

  update: (clipJobId: string, body: ClipUpdateRequest) =>
    apiFetch<ClipStatusResponse>(`/clips/jobs/${clipJobId}`, { method: "PATCH", body }),

  remove: (clipJobId: string) => apiFetch<void>(`/clips/jobs/${clipJobId}`, { method: "DELETE" }),

  retry: (clipJobId: string) =>
    apiFetch<ClipStatusResponse>(`/clips/jobs/${clipJobId}/retry`, { method: "POST" }),
};
