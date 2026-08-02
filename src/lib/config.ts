const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const API_ROOT_URL = RAW_API_URL.replace(/\/+$/, "");
export const API_BASE_URL = `${API_ROOT_URL}/api/v1`;
