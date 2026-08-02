"use client";

import { useState } from "react";
import { Archive, ArchiveRestore, MoreHorizontal, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RenameDialog } from "./rename-dialog";
import { ConfirmDialog } from "./confirm-dialog";

export function JobActionsMenu({
  title,
  archived,
  canRetry,
  onRename,
  onToggleArchive,
  onDelete,
  onRetry,
}: {
  title: string;
  archived: boolean;
  canRetry: boolean;
  onRename: (title: string) => Promise<void>;
  onToggleArchive: () => Promise<void>;
  onDelete: () => Promise<void>;
  onRetry?: () => Promise<void>;
}) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="More actions"
              onClick={(e) => e.stopPropagation()}
            />
          }
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onClick={() => setRenameOpen(true)}>
            <Pencil /> Rename
          </DropdownMenuItem>
          {canRetry && onRetry && (
            <DropdownMenuItem onClick={onRetry}>
              <RotateCcw /> Retry
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onToggleArchive}>
            {archived ? (
              <>
                <ArchiveRestore /> Unarchive
              </>
            ) : (
              <>
                <Archive /> Archive
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        initialTitle={title}
        onRename={onRename}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this?"
        description="This permanently removes it and any associated files. This can't be undone."
        confirmLabel="Delete"
        onConfirm={onDelete}
      />
    </>
  );
}
