"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ListVideo, Plus } from "lucide-react";
import { playlistsApi } from "@/lib/api/playlists";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaylistActionsMenu } from "@/components/playlists/playlist-actions-menu";
import { NewPlaylistDialog } from "@/components/playlists/new-playlist-dialog";
import { timeAgo } from "@/lib/utils";

export default function PlaylistsPage() {
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["playlists", "list"],
    queryFn: () => playlistsApi.list(),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["playlists"] });
  }

  const playlists = query.data?.playlists ?? [];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Playlists</h1>
          <p className="text-sm text-muted-foreground">
            Organize transcripts, dubs, and clips your way.
          </p>
        </div>
        <Button onClick={() => setNewDialogOpen(true)} className="gap-2">
          <Plus className="size-4" /> New playlist
        </Button>
      </div>

      {query.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : playlists.length === 0 ? (
        <Card className="items-center gap-4 py-16 text-center">
          <CardContent className="flex flex-col items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-full border border-border text-muted-foreground">
              <ListVideo className="size-6" />
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">No playlists yet</h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Create a playlist to group related transcripts, dubs, and clips together.
              </p>
            </div>
            <Button onClick={() => setNewDialogOpen(true)} className="gap-2">
              <Plus className="size-4" /> New playlist
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist) => (
            <Card key={playlist.id} className="gap-2 p-5">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/dashboard/playlists/${playlist.id}`} className="min-w-0 flex-1">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <ListVideo className="size-4" />
                  </span>
                </Link>
                <PlaylistActionsMenu
                  name={playlist.name}
                  onRename={async (name) => {
                    await playlistsApi.rename(playlist.id, { name });
                    invalidate();
                    toast.success("Renamed");
                  }}
                  onDelete={async () => {
                    await playlistsApi.remove(playlist.id);
                    invalidate();
                    toast.success("Deleted");
                  }}
                />
              </div>
              <Link href={`/dashboard/playlists/${playlist.id}`}>
                <p className="truncate text-sm font-medium">{playlist.name}</p>
                <p className="text-xs text-muted-foreground">
                  {playlist.item_count} item{playlist.item_count !== 1 ? "s" : ""} &middot; Updated{" "}
                  {timeAgo(playlist.updated_at)}
                </p>
              </Link>
            </Card>
          ))}
        </div>
      )}

      <NewPlaylistDialog open={newDialogOpen} onOpenChange={setNewDialogOpen} />
    </div>
  );
}
