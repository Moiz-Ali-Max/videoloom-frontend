import { apiFetch, apiFetchBlob } from "../api-client";
import type {
  JobListResponse,
  JobStatusResponse,
  JobUpdateRequest,
  SubtitleFormat,
  TranscriptionJobResponse,
} from "../types/transcription";
import { ListJobsParams, toQuery } from "./shared";

export const transcriptionApi = {
  createFromYoutube: (youtubeUrl: string) => {
    const form = new FormData();
    form.set("youtube_url", youtubeUrl);
    return apiFetch<TranscriptionJobResponse>("/transcription/", {
      method: "POST",
      body: form,
      isForm: true,
    });
  },

  createFromFile: (file: File) => {
    const form = new FormData();
    form.set("file", file);
    return apiFetch<TranscriptionJobResponse>("/transcription/", {
      method: "POST",
      body: form,
      isForm: true,
    });
  },

  list: (params: ListJobsParams = {}) =>
    apiFetch<JobListResponse>(`/transcription/jobs/${toQuery(params)}`),

  get: (jobId: string) => apiFetch<JobStatusResponse>(`/transcription/jobs/${jobId}`),

  update: (jobId: string, body: JobUpdateRequest) =>
    apiFetch<JobStatusResponse>(`/transcription/jobs/${jobId}`, { method: "PATCH", body }),

  remove: (jobId: string) => apiFetch<void>(`/transcription/jobs/${jobId}`, { method: "DELETE" }),

  retry: (jobId: string) =>
    apiFetch<JobStatusResponse>(`/transcription/jobs/${jobId}/retry`, { method: "POST" }),

  downloadSubtitles: (jobId: string, format: SubtitleFormat = "srt") =>
    apiFetchBlob(`/transcription/jobs/${jobId}/subtitles?format=${format}`),
};
