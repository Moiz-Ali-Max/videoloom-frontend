"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Captions,
  GripVertical,
  Languages,
  ListVideo,
  Loader2,
  Pencil,
  Plus,
  Scissors,
  X,
  type LucideIcon,
} from "lucide-react";
import { playlistsApi } from "@/lib/api/playlists";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { PlaylistActionsMenu } from "@/components/playlists/playlist-actions-menu";
import { AddItemDialog } from "@/components/playlists/add-item-dialog";
import { cn } from "@/lib/utils";
import type { JobStatus } from "@/lib/types/common";
import type { PlaylistDetail, PlaylistItem, PlaylistItemType } from "@/lib/types/playlists";

const TYPE_ICON: Record<PlaylistItemType, LucideIcon> = {
  transcription: Captions,
  dubbing: Languages,
  clip: Scissors,
};

const TYPE_HREF: Record<PlaylistItemType, string> = {
  transcription: "/dashboard/transcriptions",
  dubbing: "/dashboard/dubbing",
  clip: "/dashboard/clips",
};

const KNOWN_STATUSES = new Set(["pending", "processing", "completed", "failed"]);

export default function PlaylistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const query = useQuery({
    queryKey: ["playlists", "detail", id],
    queryFn: () => playlistsApi.get(id),
  });

  const playlist = query.data;

  function invalidateAll() {
    queryClient.invalidateQueries({ queryKey: ["playlists"] });
  }

  async function moveItem(fromIndex: number, toIndex: number) {
    if (!playlist) return;
    const reordered = [...playlist.items];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    queryClient.setQueryData<PlaylistDetail>(["playlists", "detail", id], {
      ...playlist,
      items: reordered,
    });

    try {
      await playlistsApi.reorder(id, { item_ids: reordered.map((it) => it.id) });
    } catch {
      toast.error("Couldn't save the new order");
      queryClient.invalidateQueries({ queryKey: ["playlists", "detail", id] });
    }
  }

  async function handleRemove(itemRowId: string) {
    await playlistsApi.removeItem(id, itemRowId);
    invalidateAll();
    toast.success("Removed");
  }

  async function handleRelabel(itemRowId: string, label: string) {
    await playlistsApi.relabelItem(id, itemRowId, { label: label || null });
    invalidateAll();
  }

  if (query.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-muted-foreground">Playlist not found.</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/playlists")}>
          Back to playlists
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <Link
        href="/dashboard/playlists"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to playlists
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight">{playlist.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {playlist.items.length} item{playlist.items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setAddOpen(true)} className="gap-2">
            <Plus className="size-4" /> Add item
          </Button>
          <PlaylistActionsMenu
            name={playlist.name}
            onRename={async (name) => {
              await playlistsApi.rename(id, { name });
              invalidateAll();
              toast.success("Renamed");
            }}
            onDelete={async () => {
              await playlistsApi.remove(id);
              invalidateAll();
              toast.success("Deleted");
              router.push("/dashboard/playlists");
            }}
          />
        </div>
      </div>

      {playlist.items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card px-5 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <ListVideo className="size-5" />
          </span>
          <p className="text-sm text-muted-foreground">
            This playlist is empty. Add a transcript, dub, or clip to get started.
          </p>
        </div>
      ) : (
        <div className="flex flex-col rounded-xl border border-border/60 bg-card">
          {playlist.items.map((item, index) => (
            <PlaylistItemRow
              key={item.id}
              item={item}
              isDragging={dragIndex === index}
              isLast={index === playlist.items.length - 1}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null && dragIndex !== index) moveItem(dragIndex, index);
                setDragIndex(null);
              }}
              onRemove={() => handleRemove(item.id)}
              onRelabel={(label) => handleRelabel(item.id, label)}
            />
          ))}
        </div>
      )}

      <AddItemDialog playlistId={id} open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}

function PlaylistItemRow({
  item,
  isDragging,
  isLast,
  onDragStart,
  onDragOver,
  onDrop,
  onRemove,
  onRelabel,
}: {
  item: PlaylistItem;
  isDragging: boolean;
  isLast: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onRemove: () => void;
  onRelabel: (label: string) => void;
}) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelDraft, setLabelDraft] = useState(item.label ?? "");
  const Icon = TYPE_ICON[item.item_type];

  function commitLabel() {
    setEditingLabel(false);
    if (labelDraft.trim() !== (item.label ?? "")) {
      onRelabel(labelDraft.trim());
    }
  }

  return (
    <div
      draggable={!editingLabel}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        "flex items-center gap-3 px-4 py-3",
        !isLast && "border-b border-border/60",
        isDragging && "opacity-40",
      )}
    >
      <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground" />

      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>

      <div className="min-w-0 flex-1">
        {item.exists ? (
          <Link
            href={`${TYPE_HREF[item.item_type]}/${item.item_id}`}
            className="truncate text-sm font-medium hover:underline"
          >
            {item.title || "Untitled"}
          </Link>
        ) : (
          <p className="truncate text-sm font-medium text-muted-foreground line-through">
            {item.title || "Deleted item"}
          </p>
        )}

        {editingLabel ? (
          <Input
            autoFocus
            value={labelDraft}
            onChange={(e) => setLabelDraft(e.target.value)}
            onBlur={commitLabel}
            onKeyDown={(e) => e.key === "Enter" && commitLabel()}
            maxLength={120}
            className="mt-1 h-6 text-xs"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditingLabel(true)}
            className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Pencil className="size-3" />
            {item.label || "Add label"}
          </button>
        )}
      </div>

      {item.status && KNOWN_STATUSES.has(item.status) && (
        <StatusBadge status={item.status as JobStatus} />
      )}
      {!item.exists && (
        <span className="text-xs text-muted-foreground">Removed</span>
      )}

      <Button variant="ghost" size="icon" aria-label="Remove from playlist" onClick={onRemove}>
        <X className="size-4" />
      </Button>
    </div>
  );
}
