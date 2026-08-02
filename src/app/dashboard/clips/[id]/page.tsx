"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Download, Loader2, TriangleAlert } from "lucide-react";
import { clipsApi } from "@/lib/api/clips";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ExternalLinkButton } from "@/components/shared/external-link-button";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { JobActionsMenu } from "@/components/dashboard/job-actions-menu";
import { clipJobTitle, timeAgo } from "@/lib/utils";

export default function ClipDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["clips", "detail", id],
    queryFn: () => clipsApi.get(id),
    refetchInterval: (q) => {
      const s = q.state.data?.status;
      return s === "pending" || s === "processing" ? 3000 : false;
    },
  });

  const job = query.data;

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["clips"] });
  }

  async function handleRename(title: string) {
    await clipsApi.update(id, { title });
    invalidate();
    toast.success("Renamed");
  }

  async function handleToggleArchive() {
    if (!job) return;
    await clipsApi.update(id, { archived: !job.archived });
    invalidate();
    toast.success(job.archived ? "Restored from archive" : "Archived");
  }

  async function handleDelete() {
    await clipsApi.remove(id);
    invalidate();
    toast.success("Deleted");
    router.push("/dashboard/clips");
  }

  async function handleRetry() {
    await clipsApi.retry(id);
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
        <p className="text-muted-foreground">Clip batch not found.</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/clips")}>
          Back to clips
        </Button>
      </div>
    );
  }

  const title = clipJobTitle(job);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <Link
        href="/dashboard/clips"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to clips
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Created {timeAgo(job.created_at)}</p>
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
          <AlertTitle>Clip generation failed</AlertTitle>
          <AlertDescription>
            {job.error_message || "Something went wrong while generating clips."}
          </AlertDescription>
        </Alert>
      )}

      {job.status === "completed" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {job.clips.map((clip, i) => (
            <Card key={i} className="gap-3 overflow-hidden py-0">
              <div className="aspect-9/16 w-full bg-black">
                {clip.download_url && (
                  <video controls className="size-full object-contain" src={clip.download_url} />
                )}
              </div>
              <CardContent className="flex flex-col gap-3 px-4 pb-4">
                <div>
                  <p className="truncate text-sm font-medium">{clip.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDuration(clip.duration)} &middot; {formatTimestamp(clip.start)}–
                    {formatTimestamp(clip.end)}
                  </p>
                </div>
                {clip.download_url && (
                  <ExternalLinkButton
                    href={clip.download_url}
                    download
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="size-4" /> Download
                  </ExternalLinkButton>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatDuration(seconds: number): string {
  return `${Math.round(seconds)}s`;
}
