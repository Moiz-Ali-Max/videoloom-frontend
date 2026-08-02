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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LabeledSelect } from "@/components/dashboard/labeled-select";
import { transcriptionApi } from "@/lib/api/transcription";
import { dubbingApi } from "@/lib/api/dubbing";
import { ApiError } from "@/lib/api-client";
import { transcriptionTitle } from "@/lib/utils";

export function NewDubDialog({
  open,
  onOpenChange,
  initialTranscriptionJobId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTranscriptionJobId?: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [transcriptionJobId, setTranscriptionJobId] = useState(initialTranscriptionJobId ?? "");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Adjust state during render when the prop changes, per React's guidance —
  // avoids an effect for what's really a derived-from-props value.
  const [syncedInitialId, setSyncedInitialId] = useState(initialTranscriptionJobId);
  if (initialTranscriptionJobId !== syncedInitialId) {
    setSyncedInitialId(initialTranscriptionJobId);
    if (initialTranscriptionJobId) setTranscriptionJobId(initialTranscriptionJobId);
  }

  const transcriptions = useQuery({
    queryKey: ["transcriptions", "completed-options"],
    queryFn: () => transcriptionApi.list({ status: "completed", limit: 50 }),
    enabled: open,
  });

  const languages = useQuery({
    queryKey: ["dubbing-languages"],
    queryFn: () => dubbingApi.languages(),
    staleTime: Infinity,
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!transcriptionJobId || !targetLanguage) return;
    setError(null);
    setLoading(true);
    try {
      const job = await dubbingApi.create({
        transcription_job_id: transcriptionJobId,
        target_language: targetLanguage,
      });
      toast.success("Dubbing started");
      queryClient.invalidateQueries({ queryKey: ["dubbing"] });
      onOpenChange(false);
      router.push(`/dashboard/dubbing/${job.dub_job_id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const options = transcriptions.data?.jobs ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New dub</DialogTitle>
          <DialogDescription>
            Translate a completed transcript into another language with AI voice.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Source transcription</Label>
            <LabeledSelect
              value={transcriptionJobId}
              onChange={setTranscriptionJobId}
              placeholder="Choose a completed transcription"
              emptyMessage="No completed transcriptions yet."
              options={options.map((job) => ({ value: job.job_id, label: transcriptionTitle(job) }))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Target language</Label>
            <LabeledSelect
              value={targetLanguage}
              onChange={setTargetLanguage}
              placeholder="Choose a language"
              options={(languages.data ?? []).map((lang) => ({ value: lang.code, label: lang.label }))}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            disabled={loading || !transcriptionJobId || !targetLanguage}
            className="gap-2"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Start dubbing
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
