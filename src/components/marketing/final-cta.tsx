import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/shared/link-button";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-card px-8 py-16 text-center sm:px-16">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Ready to loom your next video?
        </h2>
        <p className="max-w-xl text-lg text-muted-foreground">
          Create a free account and turn your first video into a transcript, a dub, and a set of
          clips — today.
        </p>
        <LinkButton href="/signup" size="lg" className="gap-2">
          Get started free <ArrowRight className="size-4" />
        </LinkButton>
        <p className="text-xs text-muted-foreground">No credit card required.</p>
      </div>
    </section>
  );
}
