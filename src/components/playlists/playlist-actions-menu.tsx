"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RenameDialog } from "@/components/dashboard/rename-dialog";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";

export function PlaylistActionsMenu({
  name,
  onRename,
  onDelete,
}: {
  name: string;
  onRename: (name: string) => Promise<void>;
  onDelete: () => Promise<void>;
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
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameDialog open={renameOpen} onOpenChange={setRenameOpen} initialTitle={name} onRename={onRename} />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this playlist?"
        description="This removes the playlist. Items in it are not deleted, just unlinked."
        confirmLabel="Delete"
        onConfirm={onDelete}
      />
    </>
  );
}
