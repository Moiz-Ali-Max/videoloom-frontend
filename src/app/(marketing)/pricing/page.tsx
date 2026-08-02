import type { Metadata } from "next";
import { Info } from "lucide-react";
import { PricingTiers } from "@/components/marketing/pricing-tiers";
import { PricingFaq } from "@/components/marketing/pricing-faq";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for VideoLoom's transcription, dubbing, AI clips, chat, and playlist tools.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Simple pricing, <span className="text-brand">still in early access</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Pick the plan that matches how you&rsquo;ll use VideoLoom. Paid tiers are on the way — for now,
          everything is free.
        </p>
      </div>

      <div className="mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
        <Info className="size-4 shrink-0 text-brand" />
        <p className="text-muted-foreground">
          VideoLoom is in early access. Every feature below is free to use today — Pro and
          Business plans are coming soon.
        </p>
      </div>

      <div className="mt-16">
        <PricingTiers />
      </div>

      <div className="mt-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Frequently asked questions</h2>
        </div>
        <div className="mt-10">
          <PricingFaq />
        </div>
      </div>
    </div>
  );
}
