import type { JobStatus, PaginatedJobs, SourceType } from "./common";

export type SubtitleFormat = "srt" | "vtt";

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface TranscriptResult {
  source: string; // "youtube_captions" | "whisper"
  language: string | null;
  text: string;
  segments: TranscriptSegment[];
}

export interface TranscriptionJobResponse {
  job_id: string;
  status: JobStatus;
  created_at: string;
}

export interface JobStatusResponse {
  job_id: string;
  status: JobStatus;
  source_type: SourceType | null;
  language: string | null;
  result: TranscriptResult | null;
  error_message: string | null;
  stage: string | null;
  progress: number;
  title: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export type JobListResponse = PaginatedJobs<JobStatusResponse>;

export interface JobUpdateRequest {
  title?: string | null;
  archived?: boolean | null;
}
