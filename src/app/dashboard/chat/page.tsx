"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import { transcriptionApi } from "@/lib/api/transcription";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LinkButton } from "@/components/shared/link-button";
import { transcriptionTitle, timeAgo } from "@/lib/utils";

export default function ChatIndexPage() {
  const query = useQuery({
    queryKey: ["transcriptions", "chat-options"],
    queryFn: () => transcriptionApi.list({ status: "completed", limit: 50 }),
  });

  const jobs = query.data?.jobs ?? [];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI Video Chat</h1>
        <p className="text-sm text-muted-foreground">
          Pick a completed transcription and ask it anything.
        </p>
      </div>

      {query.isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <Card className="items-center gap-4 py-16 text-center">
          <CardContent className="flex flex-col items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-full border border-border text-muted-foreground">
              <MessageSquare className="size-6" />
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">No transcripts to chat with yet</h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Finish a transcription first, then come back here to ask it questions.
              </p>
            </div>
            <LinkButton href="/dashboard/transcriptions">Go to transcriptions</LinkButton>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {jobs.map((job) => (
            <Link
              key={job.job_id}
              href={`/dashboard/chat/${job.job_id}`}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-5 py-4 transition-colors hover:border-brand/40 hover:bg-muted/30"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <MessageSquare className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{transcriptionTitle(job)}</p>
                <p className="text-xs text-muted-foreground">{timeAgo(job.created_at)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
