export type JobStatus = "pending" | "processing" | "completed" | "failed";
export type SourceType = "youtube" | "local_file";

export interface PaginatedJobs<T> {
  jobs: T[];
  total: number;
  page: number;
  limit: number;
}
