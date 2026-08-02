import Link from "next/link";
import { AudioLines } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2 font-heading text-lg font-semibold", className)}
    >
      <span className="flex size-8 items-center justify-center rounded-md bg-foreground text-background">
        <AudioLines className="size-4.5" strokeWidth={2.25} />
      </span>
      <span className="text-foreground">
        Video<span className="text-brand">Loom</span>
      </span>
    </Link>
  );
}
