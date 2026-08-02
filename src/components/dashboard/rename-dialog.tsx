"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RenameDialog({
  open,
  onOpenChange,
  initialTitle,
  onRename,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTitle: string;
  onRename: (title: string) => Promise<void>;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await onRename(trimmed);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setTitle(initialTitle);
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename</DialogTitle>
          <DialogDescription>Give this a name that&rsquo;s easy to recognize later.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rename-title">Title</Label>
            <Input
              id="rename-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={saving || !title.trim()} className="gap-2">
              {saving && <Loader2 className="size-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
