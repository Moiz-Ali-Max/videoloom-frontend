"use client";

import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LabeledSelect } from "@/components/dashboard/labeled-select";
import { transcriptionApi } from "@/lib/api/transcription";
import { dubbingApi } from "@/lib/api/dubbing";
import { clipsApi } from "@/lib/api/clips";
import { playlistsApi } from "@/lib/api/playlists";
import { ApiError } from "@/lib/api-client";
import { transcriptionTitle, dubbingTitle, clipJobTitle } from "@/lib/utils";
import type { PlaylistItemType } from "@/lib/types/playlists";

export function AddItemDialog({
  playlistId,
  open,
  onOpenChange,
}: {
  playlistId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<PlaylistItemType>("transcription");
  const [itemId, setItemId] = useState("");
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transcriptions = useQuery({
    queryKey: ["transcriptions", "playlist-options"],
    queryFn: () => transcriptionApi.list({ limit: 50 }),
    enabled: open && tab === "transcription",
  });
  const dubs = useQuery({
    queryKey: ["dubbing", "playlist-options"],
    queryFn: () => dubbingApi.list({ limit: 50 }),
    enabled: open && tab === "dubbing",
  });
  const clips = useQuery({
    queryKey: ["clips", "playlist-options"],
    queryFn: () => clipsApi.list({ limit: 50 }),
    enabled: open && tab === "clip",
  });

  function reset() {
    setItemId("");
    setLabel("");
    setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!itemId) return;
    setError(null);
    setLoading(true);
    try {
      await playlistsApi.addItem(playlistId, {
        item_type: tab,
        item_id: itemId,
        label: label.trim() || undefined,
      });
      toast.success("Added to playlist");
      queryClient.invalidateQueries({ queryKey: ["playlists", "detail", playlistId] });
      queryClient.invalidateQueries({ queryKey: ["playlists", "list"] });
      reset();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to playlist</DialogTitle>
          <DialogDescription>Pick an item to add to this playlist.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Tabs
            value={tab}
            onValueChange={(v) => {
              if (v) {
                setTab(v as PlaylistItemType);
                setItemId("");
              }
            }}
          >
            <TabsList className="w-full">
              <TabsTrigger value="transcription" className="flex-1">
                Transcripts
              </TabsTrigger>
              <TabsTrigger value="dubbing" className="flex-1">
                Dubs
              </TabsTrigger>
              <TabsTrigger value="clip" className="flex-1">
                Clips
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transcription" className="pt-3">
              <LabeledSelect
                placeholder="Choose a transcription"
                emptyMessage="Nothing available yet."
                value={itemId}
                onChange={setItemId}
                options={(transcriptions.data?.jobs ?? []).map((j) => ({
                  value: j.job_id,
                  label: transcriptionTitle(j),
                }))}
              />
            </TabsContent>
            <TabsContent value="dubbing" className="pt-3">
              <LabeledSelect
                placeholder="Choose a dub"
                emptyMessage="Nothing available yet."
                value={itemId}
                onChange={setItemId}
                options={(dubs.data?.jobs ?? []).map((j) => ({
                  value: j.dub_job_id,
                  label: dubbingTitle(j),
                }))}
              />
            </TabsContent>
            <TabsContent value="clip" className="pt-3">
              <LabeledSelect
                placeholder="Choose a clip batch"
                emptyMessage="Nothing available yet."
                value={itemId}
                onChange={setItemId}
                options={(clips.data?.jobs ?? []).map((j) => ({
                  value: j.clip_job_id,
                  label: clipJobTitle(j),
                }))}
              />
            </TabsContent>
          </Tabs>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="item-label">Label (optional)</Label>
            <Input
              id="item-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={120}
              placeholder="e.g. Final cut"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={loading || !itemId} className="gap-2">
            {loading && <Loader2 className="size-4 animate-spin" />}
            Add to playlist
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
