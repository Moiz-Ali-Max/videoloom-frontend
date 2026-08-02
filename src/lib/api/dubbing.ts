import { apiFetch, apiFetchBlob } from "../api-client";
import type {
  DubbingJobListResponse,
  DubbingJobResponse,
  DubbingLanguage,
  DubbingRequest,
  DubbingStatusResponse,
  DubbingUpdateRequest,
} from "../types/dubbing";
import { ListJobsParams, toQuery } from "./shared";

export const dubbingApi = {
  create: (body: DubbingRequest) => apiFetch<DubbingJobResponse>("/dubbing/", { method: "POST", body }),

  list: (params: ListJobsParams = {}) =>
    apiFetch<DubbingJobListResponse>(`/dubbing/jobs/${toQuery(params)}`),

  get: (dubJobId: string) => apiFetch<DubbingStatusResponse>(`/dubbing/jobs/${dubJobId}`),

  update: (dubJobId: string, body: DubbingUpdateRequest) =>
    apiFetch<DubbingStatusResponse>(`/dubbing/jobs/${dubJobId}`, { method: "PATCH", body }),

  remove: (dubJobId: string) => apiFetch<void>(`/dubbing/jobs/${dubJobId}`, { method: "DELETE" }),

  retry: (dubJobId: string) =>
    apiFetch<DubbingStatusResponse>(`/dubbing/jobs/${dubJobId}/retry`, { method: "POST" }),

  /** WebVTT track for the in-app player. Returns a Blob — build an object URL for <track src>. */
  fetchSubtitlesVtt: (dubJobId: string) => apiFetchBlob(`/dubbing/jobs/${dubJobId}/subtitles.vtt`),

  /** Note: backend's "code" field is the language KEY (e.g. "urdu"), not an ISO code — pass it
   *  straight through as DubbingRequest.target_language. */
  languages: () => apiFetch<DubbingLanguage[]>("/dubbing/languages", { auth: false }),
};
