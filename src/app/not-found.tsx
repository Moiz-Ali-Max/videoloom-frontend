import { Compass } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { LinkButton } from "@/components/shared/link-button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-grid-fade px-6 text-center">
      <Logo />
      <span className="flex size-16 items-center justify-center rounded-full border border-border text-muted-foreground">
        <Compass className="size-7" />
      </span>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-brand">404</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          This page got lost in the edit
        </h1>
        <p className="max-w-md text-muted-foreground">
          The page you’re looking for doesn’t exist or may have moved. Let’s get you back on
          track.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <LinkButton href="/" size="lg">
          Back to home
        </LinkButton>
        <LinkButton href="/dashboard" variant="outline" size="lg">
          Go to dashboard
        </LinkButton>
      </div>
    </div>
  );
}
