"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Captions,
  Download,
  Languages,
  Loader2,
  MessageSquare,
  Scissors,
  TriangleAlert,
} from "lucide-react";
import { transcriptionApi } from "@/lib/api/transcription";
import { ApiError, triggerBlobDownload } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/shared/link-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { JobActionsMenu } from "@/components/dashboard/job-actions-menu";
import { timeAgo, transcriptionTitle } from "@/lib/utils";

export default function TranscriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [downloading, setDownloading] = useState<"srt" | "vtt" | null>(null);

  const query = useQuery({
    queryKey: ["transcriptions", "detail", id],
    queryFn: () => transcriptionApi.get(id),
    refetchInterval: (q) => {
      const s = q.state.data?.status;
      return s === "pending" || s === "processing" ? 3000 : false;
    },
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["transcriptions"] });
  }

  async function handleRename(title: string) {
    await transcriptionApi.update(id, { title });
    invalidate();
    toast.success("Renamed");
  }

  async function handleToggleArchive() {
    if (!job) return;
    await transcriptionApi.update(id, { archived: !job.archived });
    invalidate();
    toast.success(job.archived ? "Restored from archive" : "Archived");
  }

  async function handleDelete() {
    await transcriptionApi.remove(id);
    invalidate();
    toast.success("Deleted");
    router.push("/dashboard/transcriptions");
  }

  async function handleRetry() {
    await transcriptionApi.retry(id);
    invalidate();
    toast.success("Retrying");
  }

  async function handleDownload(format: "srt" | "vtt") {
    setDownloading(format);
    try {
      const { blob, filename } = await transcriptionApi.downloadSubtitles(id, format);
      triggerBlobDownload(blob, filename ?? `transcript.${format}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Download failed");
    } finally {
      setDownloading(null);
    }
  }

  if (query.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const job = query.data;

  if (!job) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-muted-foreground">Transcription not found.</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/transcriptions")}>
          Back to transcriptions
        </Button>
      </div>
    );
  }

  const title = transcriptionTitle(job);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <Link
        href="/dashboard/transcriptions"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to transcriptions
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Created {timeAgo(job.created_at)} &middot; Updated {timeAgo(job.updated_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={job.status} />
          <JobActionsMenu
            title={title}
            archived={job.archived}
            canRetry={job.status === "failed"}
            onRename={handleRename}
            onToggleArchive={handleToggleArchive}
            onDelete={handleDelete}
            onRetry={handleRetry}
          />
        </div>
      </div>

      {(job.status === "pending" || job.status === "processing") && (
        <Card className="items-center gap-4 py-16 text-center">
          <CardContent className="flex w-full max-w-sm flex-col items-center gap-4">
            <Loader2 className="size-6 animate-spin text-brand" />
            <div>
              <p className="font-medium">{job.stage || "Getting started…"}</p>
              <p className="text-sm text-muted-foreground">This updates automatically.</p>
            </div>
            <Progress value={job.progress} className="w-full" />
          </CardContent>
        </Card>
      )}

      {job.status === "failed" && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>Transcription failed</AlertTitle>
          <AlertDescription>
            {job.error_message || "Something went wrong while processing this video."}
          </AlertDescription>
        </Alert>
      )}

      {job.status === "completed" && job.result && (
        <>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="gap-2"
              disabled={downloading === "srt"}
              onClick={() => handleDownload("srt")}
            >
              {downloading === "srt" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              Download .srt
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              disabled={downloading === "vtt"}
              onClick={() => handleDownload("vtt")}
            >
              {downloading === "vtt" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              Download .vtt
            </Button>
            <LinkButton href={`/dashboard/dubbing?transcriptionJobId=${id}`} variant="outline" className="gap-2">
              <Languages className="size-4" /> Dub this video
            </LinkButton>
            <LinkButton href={`/dashboard/clips?transcriptionJobId=${id}`} variant="outline" className="gap-2">
              <Scissors className="size-4" /> Generate clips
            </LinkButton>
            <LinkButton href={`/dashboard/chat/${id}`} variant="outline" className="gap-2">
              <MessageSquare className="size-4" /> Chat about this video
            </LinkButton>
          </div>

          <Card className="gap-0 py-0">
            <CardHeader className="flex-row items-center justify-between border-b border-border/60 px-5 py-4">
              <div className="flex items-center gap-2">
                <Captions className="size-4 text-muted-foreground" />
                <h2 className="font-heading text-base font-semibold">Transcript</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                {job.result.language?.toUpperCase() || "—"} &middot;{" "}
                {job.result.source === "youtube_captions" ? "YouTube captions" : "Whisper"}
              </p>
            </CardHeader>
            <CardContent className="px-0">
              {job.result.segments.length > 0 ? (
                <ScrollArea className="h-[28rem]">
                  <div className="flex flex-col divide-y divide-border/60">
                    {job.result.segments.map((seg, i) => (
                      <div key={i} className="flex gap-4 px-5 py-3">
                        <span className="w-14 shrink-0 font-mono text-xs text-muted-foreground">
                          {formatTimestamp(seg.start)}
                        </span>
                        <p className="text-sm">{seg.text}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="whitespace-pre-wrap px-5 py-4 text-sm leading-relaxed">
                  {job.result.text}
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
