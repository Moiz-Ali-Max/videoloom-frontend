import type { ComponentProps } from "react";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ExternalLinkButtonProps = ComponentProps<"a"> & VariantProps<typeof buttonVariants>;

/** For signed Supabase Storage download URLs — real <a> tags, not routed through next/link. */
export function ExternalLinkButton({ className, variant, size, ...props }: ExternalLinkButtonProps) {
  return <a className={cn(buttonVariants({ variant, size }), className)} target="_blank" rel="noopener noreferrer" {...props} />;
}
