"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { transcriptionApi } from "@/lib/api/transcription";
import { ApiError } from "@/lib/api-client";

const ACCEPTED = ".mp3,.mp4,.wav,.m4a,.ogg,.flac,.webm,.mkv,.avi,.mov,.mpeg,.mpga";

export function NewTranscriptionDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onDone(jobId: string) {
    toast.success("Transcription started");
    queryClient.invalidateQueries({ queryKey: ["transcriptions"] });
    setYoutubeUrl("");
    setFile(null);
    setLoading(false);
    onOpenChange(false);
    router.push(`/dashboard/transcriptions/${jobId}`);
  }

  async function handleYoutubeSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const job = await transcriptionApi.createFromYoutube(youtubeUrl.trim());
      onDone(job.job_id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  async function handleFileSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    setError(null);
    setLoading(true);
    try {
      const job = await transcriptionApi.createFromFile(file);
      onDone(job.job_id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setError(null);
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New transcription</DialogTitle>
          <DialogDescription>Paste a YouTube link or upload a file up to 25 MB.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="youtube">
          <TabsList className="w-full">
            <TabsTrigger value="youtube" className="flex-1">
              YouTube URL
            </TabsTrigger>
            <TabsTrigger value="file" className="flex-1">
              Upload file
            </TabsTrigger>
          </TabsList>

          <TabsContent value="youtube">
            <form onSubmit={handleYoutubeSubmit} className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="youtube-url">YouTube URL</Label>
                <Input
                  id="youtube-url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={loading || !youtubeUrl.trim()} className="gap-2">
                {loading && <Loader2 className="size-4 animate-spin" />}
                Start transcription
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="file">
            <form onSubmit={handleFileSubmit} className="flex flex-col gap-4 pt-2">
              <Label
                htmlFor="file-input"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-8 text-center hover:border-brand/50 hover:bg-muted/30"
              >
                <UploadCloud className="size-6 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {file ? file.name : "Click to choose a file"}
                </span>
                <span className="text-xs text-muted-foreground">Audio or video, up to 25 MB</span>
              </Label>
              <input
                id="file-input"
                type="file"
                accept={ACCEPTED}
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={loading || !file} className="gap-2">
                {loading && <Loader2 className="size-4 animate-spin" />}
                Start transcription
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
