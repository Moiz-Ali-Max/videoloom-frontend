"use client";

import { use, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, ArrowUp, Loader2, MessageSquare } from "lucide-react";
import { chatApi } from "@/lib/api/chat";
import { transcriptionApi } from "@/lib/api/transcription";
import { ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, transcriptionTitle } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [sessionMessages, setSessionMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const jobQuery = useQuery({
    queryKey: ["transcriptions", "detail", id],
    queryFn: () => transcriptionApi.get(id),
  });

  const historyQuery = useQuery({
    queryKey: ["chat", "history", id],
    queryFn: () => chatApi.history(id),
  });

  // Derived, not copied into state — avoids mirroring async query data via an effect.
  const historyMessages: Message[] = (historyQuery.data?.messages ?? []).map((m, i) => ({
    id: `history-${i}`,
    role: m.role,
    content: m.content,
  }));
  const messages = [...historyMessages, ...sessionMessages];
  // Primitive signal for the scroll effect below — changes on every new message AND every
  // streamed chunk, without making the array itself a (referentially unstable) dependency.
  const contentSignal = messages.reduce((sum, m) => sum + m.content.length, messages.length);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [contentSignal]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const userMessage: Message = { id: `user-${Date.now()}`, role: "user", content: text };
    const assistantId = `assistant-${Date.now()}`;
    setSessionMessages((prev) => [
      ...prev,
      userMessage,
      { id: assistantId, role: "assistant", content: "", streaming: true },
    ]);
    setInput("");
    setSending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      for await (const chunk of chatApi.stream(id, text, controller.signal)) {
        setSessionMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m)),
        );
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "The assistant didn't respond. Please try again.";
      toast.error(message);
      setSessionMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setSessionMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m)),
      );
      setSending(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as unknown as FormEvent);
    }
  }

  const job = jobQuery.data;

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col p-4 sm:p-6 lg:p-8">
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/dashboard/chat"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold">
            {job ? transcriptionTitle(job) : "Chat"}
          </h1>
          <p className="text-xs text-muted-foreground">Chatting with this video&rsquo;s transcript</p>
        </div>
      </div>

      <ScrollArea className="flex-1 rounded-xl border border-border/60 bg-card">
        <div className="flex flex-col gap-4 p-4 sm:p-6">
          {historyQuery.isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-full border border-border text-muted-foreground">
                <MessageSquare className="size-5" />
              </span>
              <p className="max-w-xs text-sm text-muted-foreground">
                Ask for a summary, a key quote, or where a topic was discussed.
              </p>
            </div>
          ) : (
            messages.map((message) => <MessageBubble key={message.id} message={message} />)
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSend} className="mt-4 flex items-end gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about this video…"
          maxLength={4000}
          disabled={sending}
          className="min-h-11 flex-1 resize-none"
        />
        <Button type="submit" size="icon" disabled={sending || !input.trim()} aria-label="Send message">
          {sending ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}
        </Button>
      </form>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      <Avatar size="sm" className="mt-0.5 shrink-0">
        {isUser ? (
          <AvatarFallback>You</AvatarFallback>
        ) : (
          <AvatarFallback className="bg-foreground text-background">
            <MessageSquare className="size-3.5" />
          </AvatarFallback>
        )}
      </Avatar>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
        )}
      >
        {message.content}
        {message.streaming && !message.content && (
          <span className="inline-flex gap-1">
            <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-current" />
          </span>
        )}
      </div>
    </div>
  );
}
