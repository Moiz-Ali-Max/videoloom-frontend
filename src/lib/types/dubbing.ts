import type { JobStatus, PaginatedJobs } from "./common";

export interface DubbingRequest {
  transcription_job_id: string;
  target_language: string;
}

export interface DubbingUpdateRequest {
  title?: string | null;
  archived?: boolean | null;
}

export interface DubbingJobResponse {
  dub_job_id: string;
  status: JobStatus;
  created_at: string;
}

export interface DubbingStatusResponse {
  dub_job_id: string;
  transcription_job_id: string;
  target_language: string;
  status: JobStatus;
  download_url: string | null;
  subtitled_download_url: string | null;
  has_subtitles: boolean;
  error_message: string | null;
  stage: string | null;
  progress: number;
  title: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export type DubbingJobListResponse = PaginatedJobs<DubbingStatusResponse>;

export interface DubbingLanguage {
  label: string;
  code: string;
}
