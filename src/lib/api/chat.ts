import { ApiError, apiFetch } from "../api-client";
import { API_BASE_URL } from "../config";
import { clearTokens, getAccessToken, notifyAuthExpired } from "../token-storage";
import type { ChatHistoryResponse } from "../types/chat";

type StreamEvent = { chunk: string } | { error: string };

function parseSseEvent(rawEvent: string): StreamEvent | "done" | null {
  const line = rawEvent.trim();
  if (!line.startsWith("data:")) return null;
  const data = line.slice(5).trim();
  if (data === "[DONE]") return "done";
  try {
    return JSON.parse(data) as StreamEvent;
  } catch {
    return null;
  }
}

export const chatApi = {
  history: (jobId: string) => apiFetch<ChatHistoryResponse>(`/chat/history/${jobId}`),

  /**
   * Streams the assistant's reply token-by-token via Server-Sent Events.
   * Bypasses apiFetch (no JSON body expected) but mirrors its 401 handling.
   */
  async *stream(
    transcriptionJobId: string,
    message: string,
    signal?: AbortSignal,
  ): AsyncGenerator<string, void, unknown> {
    const token = getAccessToken();
    const res = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ transcription_job_id: transcriptionJobId, message }),
      signal,
    });

    if (!res.ok) {
      let detail = res.statusText || "Chat request failed";
      try {
        const data = await res.json();
        if (typeof data?.detail === "string") detail = data.detail;
      } catch {
        // non-JSON error body — keep statusText
      }
      if (res.status === 401) {
        clearTokens();
        notifyAuthExpired();
      }
      throw new ApiError(res.status, detail);
    }

    const reader = res.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const rawEvent of events) {
        const parsed = parseSseEvent(rawEvent);
        if (parsed === "done") return;
        if (parsed === null) continue;
        if ("error" in parsed) throw new ApiError(500, parsed.error);
        if (typeof parsed.chunk === "string") yield parsed.chunk;
      }
    }
  },
};
