"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Download, Loader2, Scissors, TriangleAlert } from "lucide-react";
import { dubbingApi } from "@/lib/api/dubbing";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/shared/link-button";
import { ExternalLinkButton } from "@/components/shared/external-link-button";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { JobActionsMenu } from "@/components/dashboard/job-actions-menu";
import { dubbingTitle, timeAgo, capitalize } from "@/lib/utils";

export default function DubbingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [subtitleUrl, setSubtitleUrl] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["dubbing", "detail", id],
    queryFn: () => dubbingApi.get(id),
    refetchInterval: (q) => {
      const s = q.state.data?.status;
      return s === "pending" || s === "processing" ? 3000 : false;
    },
  });

  const job = query.data;

  useEffect(() => {
    let objectUrl: string | null = null;

    async function loadSubtitles() {
      if (job?.status === "completed" && job.has_subtitles) {
        try {
          const { blob } = await dubbingApi.fetchSubtitlesVtt(id);
          objectUrl = URL.createObjectURL(blob);
          setSubtitleUrl(objectUrl);
        } catch {
          // No subtitle track available — the video still plays without one.
        }
      }
    }

    loadSubtitles();
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id, job?.status, job?.has_subtitles]);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["dubbing"] });
  }

  async function handleRename(title: string) {
    await dubbingApi.update(id, { title });
    invalidate();
    toast.success("Renamed");
  }

  async function handleToggleArchive() {
    if (!job) return;
    await dubbingApi.update(id, { archived: !job.archived });
    invalidate();
    toast.success(job.archived ? "Restored from archive" : "Archived");
  }

  async function handleDelete() {
    await dubbingApi.remove(id);
    invalidate();
    toast.success("Deleted");
    router.push("/dashboard/dubbing");
  }

  async function handleRetry() {
    await dubbingApi.retry(id);
    invalidate();
    toast.success("Retrying");
  }

  if (query.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-muted-foreground">Dub not found.</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/dubbing")}>
          Back to dubbing
        </Button>
      </div>
    );
  }

  const title = dubbingTitle(job);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <Link
        href="/dashboard/dubbing"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to dubbing
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {capitalize(job.target_language)} &middot; Created {timeAgo(job.created_at)}
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
          <AlertTitle>Dubbing failed</AlertTitle>
          <AlertDescription>
            {job.error_message || "Something went wrong while dubbing this video."}
          </AlertDescription>
        </Alert>
      )}

      {job.status === "completed" && (
        <>
          {job.download_url && (
            <video controls className="w-full rounded-xl border border-border/60 bg-black" src={job.download_url}>
              {subtitleUrl && (
                <track kind="subtitles" src={subtitleUrl} srcLang="en" label="Subtitles" default />
              )}
            </video>
          )}

          <div className="flex flex-wrap gap-3">
            {job.download_url && (
              <ExternalLinkButton href={job.download_url} download variant="outline" className="gap-2">
                <Download className="size-4" /> Download video
              </ExternalLinkButton>
            )}
            {job.subtitled_download_url && (
              <ExternalLinkButton
                href={job.subtitled_download_url}
                download
                variant="outline"
                className="gap-2"
              >
                <Download className="size-4" /> Download with burned-in subtitles
              </ExternalLinkButton>
            )}
            <LinkButton href={`/dashboard/clips?dubbingJobId=${id}`} variant="outline" className="gap-2">
              <Scissors className="size-4" /> Generate clips from this dub
            </LinkButton>
          </div>
        </>
      )}
    </div>
  );
}
