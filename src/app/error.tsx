"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { LinkButton } from "@/components/shared/link-button";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-grid-fade px-6 text-center">
      <Logo />
      <span className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-7" />
      </span>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-destructive">Error</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Something went wrong</h1>
        <p className="max-w-md text-muted-foreground">
          An unexpected error occurred while loading this page. You can try again, or head back
          home.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={() => unstable_retry()}>
          Try again
        </Button>
        <LinkButton href="/" variant="outline" size="lg">
          Back to home
        </LinkButton>
      </div>
    </div>
  );
}
