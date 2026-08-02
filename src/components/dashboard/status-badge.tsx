import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { JobStatus } from "@/lib/types/common";

const STATUS_STYLES: Record<JobStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground",
  },
  processing: {
    label: "Processing",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  failed: {
    label: "Failed",
    className: "bg-destructive/10 text-destructive",
  },
};

export function StatusBadge({ status, className }: { status: JobStatus; className?: string }) {
  const style = STATUS_STYLES[status];
  return (
    <Badge variant="secondary" className={cn(style.className, className)}>
      {style.label}
    </Badge>
  );
}
