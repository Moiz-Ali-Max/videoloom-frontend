import type { JobStatus, PaginatedJobs } from "./common";

export interface ClipRequest {
  transcription_job_id?: string | null;
  dubbing_job_id?: string | null;
  max_clips?: number | null;
  preference?: string | null;
}

export interface ClipUpdateRequest {
  title?: string | null;
  archived?: boolean | null;
}

export interface ClipJobResponse {
  clip_job_id: string;
  status: JobStatus;
  created_at: string;
}

export interface ClipItem {
  title: string;
  start: number;
  end: number;
  duration: number;
  download_url: string | null;
}

export interface ClipStatusResponse {
  clip_job_id: string;
  transcription_job_id: string;
  dubbing_job_id: string | null;
  status: JobStatus;
  clips: ClipItem[];
  error_message: string | null;
  stage: string | null;
  progress: number;
  title: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export type ClipJobListResponse = PaginatedJobs<ClipStatusResponse>;
