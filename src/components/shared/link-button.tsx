import Link from "next/link";
import type { ComponentProps } from "react";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LinkButtonProps = ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>;

/**
 * Base UI's Button enforces button semantics (role="button", keyboard handling) and
 * explicitly should not be composed with <a> via its `render` prop — links have their
 * own semantics. The documented pattern is to style the anchor directly instead.
 */
export function LinkButton({ className, variant, size, ...props }: LinkButtonProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
