"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Languages, Plus } from "lucide-react";
import { dubbingApi } from "@/lib/api/dubbing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { StatusFilterSelect } from "@/components/dashboard/status-filter-select";
import { PaginationControls } from "@/components/dashboard/pagination-controls";
import { JobActionsMenu } from "@/components/dashboard/job-actions-menu";
import { NewDubDialog } from "@/components/dubbing/new-dub-dialog";
import { dubbingTitle, timeAgo } from "@/lib/utils";
import type { DubbingStatusResponse } from "@/lib/types/dubbing";

const LIMIT = 10;

export default function DubbingPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [archived, setArchived] = useState(false);
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [prefillTranscriptionId, setPrefillTranscriptionId] = useState<string | undefined>();
  const queryClient = useQueryClient();

  useEffect(() => {
    // One-time read of a browser-only API (no `window` during SSR, so this can't move to render).
    const params = new URLSearchParams(window.location.search);
    const id = params.get("transcriptionJobId");
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrefillTranscriptionId(id);
      setNewDialogOpen(true);
    }
  }, []);

  const query = useQuery({
    queryKey: ["dubbing", "list", { page, status, archived }],
    queryFn: () =>
      dubbingApi.list({
        page,
        limit: LIMIT,
        status: status === "all" ? undefined : status,
        archived,
      }),
    refetchInterval: (q) => {
      const jobs = q.state.data?.jobs ?? [];
      const hasActive = jobs.some((j) => j.status === "pending" || j.status === "processing");
      return hasActive ? 3000 : false;
    },
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["dubbing"] });
  }

  async function handleRename(job: DubbingStatusResponse, title: string) {
    await dubbingApi.update(job.dub_job_id, { title });
    invalidate();
    toast.success("Renamed");
  }

  async function handleToggleArchive(job: DubbingStatusResponse) {
    await dubbingApi.update(job.dub_job_id, { archived: !job.archived });
    invalidate();
    toast.success(job.archived ? "Restored from archive" : "Archived");
  }

  async function handleDelete(job: DubbingStatusResponse) {
    await dubbingApi.remove(job.dub_job_id);
    invalidate();
    toast.success("Deleted");
  }

  async function handleRetry(job: DubbingStatusResponse) {
    await dubbingApi.retry(job.dub_job_id);
    invalidate();
    toast.success("Retrying");
  }

  const jobs = query.data?.jobs ?? [];
  const total = query.data?.total ?? 0;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dubbing</h1>
          <p className="text-sm text-muted-foreground">
            Translate transcripts into 6 languages with natural AI voices.
          </p>
        </div>
        <Button onClick={() => setNewDialogOpen(true)} className="gap-2">
          <Plus className="size-4" /> New dub
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <StatusFilterSelect
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        />
        <div className="flex items-center gap-2">
          <Switch
            id="archived-toggle"
            checked={archived}
            onCheckedChange={(checked) => {
              setArchived(checked);
              setPage(1);
            }}
          />
          <Label htmlFor="archived-toggle" className="text-sm text-muted-foreground">
            Show archived
          </Label>
        </div>
      </div>

      <Card className="gap-0 py-0">
        <CardContent className="flex flex-col divide-y divide-border/60 px-0">
          {query.isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-4">
                <Skeleton className="size-9 rounded-lg" />
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/5" />
                </div>
              </div>
            ))
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Languages className="size-5" />
              </span>
              <p className="text-sm text-muted-foreground">
                {archived ? "No archived dubs." : "No dubs yet."}
              </p>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.dub_job_id} className="flex items-center gap-3 px-5 py-4">
                <Link
                  href={`/dashboard/dubbing/${job.dub_job_id}`}
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Languages className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{dubbingTitle(job)}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{timeAgo(job.created_at)}</span>
                      {job.status === "processing" && job.stage && (
                        <>
                          <span>&middot;</span>
                          <span>{job.stage}</span>
                        </>
                      )}
                    </div>
                    {job.status === "processing" && (
                      <Progress value={job.progress} className="mt-2 max-w-40" />
                    )}
                  </div>
                </Link>
                <StatusBadge status={job.status} />
                <JobActionsMenu
                  title={dubbingTitle(job)}
                  archived={job.archived}
                  canRetry={job.status === "failed"}
                  onRename={(title) => handleRename(job, title)}
                  onToggleArchive={() => handleToggleArchive(job)}
                  onDelete={() => handleDelete(job)}
                  onRetry={() => handleRetry(job)}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <PaginationControls page={page} limit={LIMIT} total={total} onPageChange={setPage} />

      <NewDubDialog
        open={newDialogOpen}
        onOpenChange={setNewDialogOpen}
        initialTranscriptionJobId={prefillTranscriptionId}
      />
    </div>
  );
}
