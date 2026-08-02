export interface ListJobsParams {
  page?: number;
  limit?: number;
  status?: string;
  archived?: boolean;
}

export function toQuery(params: ListJobsParams): string {
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      usp.set(key, String(value));
    }
  }
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}
