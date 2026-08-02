"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { LabeledSelect } from "@/components/dashboard/labeled-select";
import { transcriptionApi } from "@/lib/api/transcription";
import { dubbingApi } from "@/lib/api/dubbing";
import { clipsApi } from "@/lib/api/clips";
import { ApiError } from "@/lib/api-client";
import { transcriptionTitle, dubbingTitle } from "@/lib/utils";

const MAX_CLIPS_OPTIONS = [1, 2, 3, 4, 5];

type SourceTab = "transcription" | "dubbing";

export function NewClipDialog({
  open,
  onOpenChange,
  initialTranscriptionJobId,
  initialDubbingJobId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTranscriptionJobId?: string;
  initialDubbingJobId?: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<SourceTab>(initialDubbingJobId ? "dubbing" : "transcription");
  const [prevInitialTx, setPrevInitialTx] = useState(initialTranscriptionJobId);
  const [prevInitialDub, setPrevInitialDub] = useState(initialDubbingJobId);
  const [transcriptionJobId, setTranscriptionJobId] = useState(initialTranscriptionJobId ?? "");
  const [dubbingJobId, setDubbingJobId] = useState(initialDubbingJobId ?? "");

  // Adjust state during render when prefill props change (see React's "you might not need an effect").
  if (initialTranscriptionJobId !== prevInitialTx) {
    setPrevInitialTx(initialTranscriptionJobId);
    if (initialTranscriptionJobId) {
      setTranscriptionJobId(initialTranscriptionJobId);
      setTab("transcription");
    }
  }
  if (initialDubbingJobId !== prevInitialDub) {
    setPrevInitialDub(initialDubbingJobId);
    if (initialDubbingJobId) {
      setDubbingJobId(initialDubbingJobId);
      setTab("dubbing");
    }
  }

  const [maxClips, setMaxClips] = useState(3);
  const [preference, setPreference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transcriptions = useQuery({
    queryKey: ["transcriptions", "completed-options"],
    queryFn: () => transcriptionApi.list({ status: "completed", limit: 50 }),
    enabled: open && tab === "transcription",
  });

  const dubs = useQuery({
    queryKey: ["dubbing", "completed-options"],
    queryFn: () => dubbingApi.list({ status: "completed", limit: 50 }),
    enabled: open && tab === "dubbing",
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const sourceId = tab === "transcription" ? transcriptionJobId : dubbingJobId;
    if (!sourceId) return;

    setError(null);
    setLoading(true);
    try {
      const job = await clipsApi.create({
        transcription_job_id: tab === "transcription" ? transcriptionJobId : undefined,
        dubbing_job_id: tab === "dubbing" ? dubbingJobId : undefined,
        max_clips: maxClips,
        preference: preference.trim() || undefined,
      });
      toast.success("Generating clips");
      queryClient.invalidateQueries({ queryKey: ["clips"] });
      onOpenChange(false);
      router.push(`/dashboard/clips/${job.clip_job_id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const transcriptionOptions = transcriptions.data?.jobs ?? [];
  const dubOptions = dubs.data?.jobs ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New clip batch</DialogTitle>
          <DialogDescription>
            Auto-cut vertical shorts with animated captions from a completed video.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Tabs value={tab} onValueChange={(v) => v && setTab(v as SourceTab)}>
            <TabsList className="w-full">
              <TabsTrigger value="transcription" className="flex-1">
                From transcription
              </TabsTrigger>
              <TabsTrigger value="dubbing" className="flex-1">
                From dub
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transcription" className="pt-3">
              <div className="flex flex-col gap-1.5">
                <Label>Source transcription</Label>
                <LabeledSelect
                  value={transcriptionJobId}
                  onChange={setTranscriptionJobId}
                  placeholder="Choose a completed transcription"
                  emptyMessage="No completed transcriptions yet."
                  options={transcriptionOptions.map((job) => ({
                    value: job.job_id,
                    label: transcriptionTitle(job),
                  }))}
                />
              </div>
            </TabsContent>

            <TabsContent value="dubbing" className="pt-3">
              <div className="flex flex-col gap-1.5">
                <Label>Source dub</Label>
                <LabeledSelect
                  value={dubbingJobId}
                  onChange={setDubbingJobId}
                  placeholder="Choose a completed dub"
                  emptyMessage="No completed dubs yet."
                  options={dubOptions.map((job) => ({
                    value: job.dub_job_id,
                    label: dubbingTitle(job),
                  }))}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col gap-1.5">
            <Label>Number of clips</Label>
            <LabeledSelect
              value={String(maxClips)}
              onChange={(v) => setMaxClips(Number(v))}
              options={MAX_CLIPS_OPTIONS.map((n) => ({
                value: String(n),
                label: `${n} clip${n > 1 ? "s" : ""}`,
              }))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="preference">Focus topic (optional)</Label>
            <Textarea
              id="preference"
              placeholder="e.g. the part about pricing strategy"
              maxLength={300}
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            disabled={loading || !(tab === "transcription" ? transcriptionJobId : dubbingJobId)}
            className="gap-2"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Generate clips
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
