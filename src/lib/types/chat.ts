export interface ChatRequest {
  transcription_job_id: string;
  message: string;
}

export interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ChatHistoryResponse {
  session_id: string;
  messages: ChatHistoryMessage[];
}
