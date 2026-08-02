"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Captions,
  LayoutGrid,
  Languages,
  ListVideo,
  MessageSquare,
  Scissors,
  type LucideIcon,
} from "lucide-react";
import { transcriptionApi } from "@/lib/api/transcription";
import { dubbingApi } from "@/lib/api/dubbing";
import { clipsApi } from "@/lib/api/clips";
import { playlistsApi } from "@/lib/api/playlists";
import type { JobStatus } from "@/lib/types/common";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { LinkButton } from "@/components/shared/link-button";
import { cn, clipJobTitle, dubbingTitle, timeAgo, transcriptionTitle } from "@/lib/utils";

interface ActivityItem {
  id: string;
  kind: "transcription" | "dubbing" | "clip";
  title: string;
  status: JobStatus;
  createdAt: string;
  href: string;
}

const QUICK_ACTIONS: { icon: LucideIcon; title: string; body: string; href: string }[] = [
  {
    icon: Captions,
    title: "New transcription",
    body: "Paste a YouTube link or upload a file",
    href: "/dashboard/transcriptions",
  },
  {
    icon: Languages,
    title: "Dub a video",
    body: "Translate a transcript into 6 languages",
    href: "/dashboard/dubbing",
  },
  {
    icon: Scissors,
    title: "Generate clips",
    body: "Auto-cut vertical shorts with captions",
    href: "/dashboard/clips",
  },
  {
    icon: MessageSquare,
    title: "Chat with a video",
    body: "Ask questions about a transcript",
    href: "/dashboard/chat",
  },
  {
    icon: ListVideo,
    title: "Build a playlist",
    body: "Organize your transcripts, dubs & clips",
    href: "/dashboard/playlists",
  },
];

export default function DashboardOverviewPage() {
  const transcriptions = useQuery({
    queryKey: ["transcriptions", "overview"],
    queryFn: () => transcriptionApi.list({ limit: 5 }),
  });
  const dubs = useQuery({
    queryKey: ["dubbing", "overview"],
    queryFn: () => dubbingApi.list({ limit: 5 }),
  });
  const clips = useQuery({
    queryKey: ["clips", "overview"],
    queryFn: () => clipsApi.list({ limit: 5 }),
  });
  const playlists = useQuery({
    queryKey: ["playlists", "overview"],
    queryFn: () => playlistsApi.list(),
  });

  const isLoading =
    transcriptions.isLoading || dubs.isLoading || clips.isLoading || playlists.isLoading;

  const activity: ActivityItem[] = [
    ...(transcriptions.data?.jobs ?? []).map((job) => ({
      id: job.job_id,
      kind: "transcription" as const,
      title: transcriptionTitle(job),
      status: job.status,
      createdAt: job.created_at,
      href: `/dashboard/transcriptions/${job.job_id}`,
    })),
    ...(dubs.data?.jobs ?? []).map((job) => ({
      id: job.dub_job_id,
      kind: "dubbing" as const,
      title: dubbingTitle(job),
      status: job.status,
      createdAt: job.created_at,
      href: `/dashboard/dubbing/${job.dub_job_id}`,
    })),
    ...(clips.data?.jobs ?? []).map((job) => ({
      id: job.clip_job_id,
      kind: "clip" as const,
      title: clipJobTitle(job),
      status: job.status,
      createdAt: job.created_at,
      href: `/dashboard/clips/${job.clip_job_id}`,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const totals = {
    transcriptions: transcriptions.data?.total ?? 0,
    dubs: dubs.data?.total ?? 0,
    clips: clips.data?.total ?? 0,
    playlists: playlists.data?.playlists.length ?? 0,
  };

  const isEmpty =
    !isLoading &&
    totals.transcriptions === 0 &&
    totals.dubs === 0 &&
    totals.clips === 0 &&
    totals.playlists === 0;

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Everything happening across your videos, at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={Captions} label="Transcriptions" value={totals.transcriptions} loading={isLoading} />
        <StatTile icon={Languages} label="Dubs" value={totals.dubs} loading={isLoading} />
        <StatTile icon={Scissors} label="Clip batches" value={totals.clips} loading={isLoading} />
        <StatTile icon={ListVideo} label="Playlists" value={totals.playlists} loading={isLoading} />
      </div>

      {isEmpty ? (
        <Card className="items-center gap-4 py-16 text-center">
          <CardContent className="flex flex-col items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-full border border-border text-muted-foreground">
              <LayoutGrid className="size-6" />
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">Nothing here yet</h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Start your first transcription and the rest of the pipeline — dubbing, clips, and
                chat — unlocks from there.
              </p>
            </div>
            <LinkButton href="/dashboard/transcriptions" className="gap-2">
              New transcription <ArrowRight className="size-4" />
            </LinkButton>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="gap-0 py-0 lg:col-span-2">
            <CardHeader className="border-b border-border/60 px-5 py-4">
              <h2 className="font-heading text-base font-semibold">Recent activity</h2>
            </CardHeader>
            <CardContent className="flex flex-col divide-y divide-border/60 px-0">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-4">
                    <Skeleton className="size-9 rounded-lg" />
                    <div className="flex-1 flex flex-col gap-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))
              ) : activity.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No activity yet.
                </p>
              ) : (
                activity.map((item) => <ActivityRow key={`${item.kind}-${item.id}`} item={item} />)
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            {QUICK_ACTIONS.slice(0, 3).map((action) => (
              <QuickActionCard key={action.href} {...action} />
            ))}
          </div>
        </div>
      )}

      {!isEmpty && (
        <div>
          <h2 className="mb-4 font-heading text-base font-semibold">Quick actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {QUICK_ACTIONS.map((action) => (
              <QuickActionCard key={action.href} {...action} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <Card className="gap-3 p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {loading ? (
        <Skeleton className="h-8 w-16" />
      ) : (
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
      )}
    </Card>
  );
}

const KIND_ICON: Record<ActivityItem["kind"], LucideIcon> = {
  transcription: Captions,
  dubbing: Languages,
  clip: Scissors,
};

function ActivityRow({ item }: { item: ActivityItem }) {
  const Icon = KIND_ICON[item.kind];
  return (
    <Link
      href={item.href}
      className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/50"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.title}</p>
        <p className="text-xs text-muted-foreground">{timeAgo(item.createdAt)}</p>
      </div>
      <StatusBadge status={item.status} />
    </Link>
  );
}

function QuickActionCard({
  icon: Icon,
  title,
  body,
  href,
  compact,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  href: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-brand/50 hover:bg-muted/30",
        compact && "gap-2.5 p-4",
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-md bg-muted text-foreground">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-sm font-medium">{title}</p>
        {!compact && <p className="text-xs text-muted-foreground">{body}</p>}
      </div>
    </Link>
  );
}
