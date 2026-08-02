import type { Metadata } from "next";
import { ArrowRight, Captions, Languages, MessageSquare, Scissors, ShieldCheck, Zap } from "lucide-react";
import { LinkButton } from "@/components/shared/link-button";

export const metadata: Metadata = {
  title: "About",
  description: "Why VideoLoom exists and what we're building toward.",
};

const VALUES = [
  {
    icon: Zap,
    title: "Fast by default",
    body: "Every job runs in the background the moment you submit it — no blocking spinners, no waiting around for a page to finish loading.",
  },
  {
    icon: ShieldCheck,
    title: "Your content stays yours",
    body: "Jobs are scoped to your account. We don't share your transcripts, dubs, or clips, and deleting a project removes its files from storage.",
  },
  {
    icon: MessageSquare,
    title: "Honest about what's real",
    body: "If a feature isn't ready yet, we'll say so — including on our pricing page, where paid plans are clearly marked as coming soon.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Video production is <span className="text-brand">the bottleneck</span>, not the
          idea
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Every long-form video hides a transcript, a set of shorts, a dubbed version for a new
          audience, and a dozen answered questions — if someone has the hours to pull them out
          manually. VideoLoom exists to do that work in minutes instead of days.
        </p>
      </div>

      <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 text-center">
          <Captions className="size-5 text-muted-foreground" />
          <p className="text-sm font-medium">Transcripts</p>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 text-center">
          <Languages className="size-5 text-muted-foreground" />
          <p className="text-sm font-medium">Dubs</p>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 text-center">
          <Scissors className="size-5 text-muted-foreground" />
          <p className="text-sm font-medium">Clips</p>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 text-center">
          <MessageSquare className="size-5 text-muted-foreground" />
          <p className="text-sm font-medium">Answers</p>
        </div>
      </div>

      <div className="mt-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">What we believe</h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {VALUES.map((value) => (
            <div key={value.title} className="flex flex-col items-start gap-4">
              <span className="flex size-11 items-center justify-center rounded-md bg-foreground text-background">
                <value.icon className="size-5" />
              </span>
              <h3 className="text-lg font-semibold">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-24 flex flex-col items-center gap-6 rounded-xl border border-border bg-muted/30 px-8 py-16 text-center">
        <h2 className="max-w-xl text-3xl font-semibold tracking-tight">
          We&rsquo;re early, and building in the open
        </h2>
        <p className="max-w-xl text-muted-foreground">
          VideoLoom is in active development. The core toolkit — transcription, dubbing, clips,
          chat, and playlists — is live today; team workspaces and paid plans are next.
        </p>
        <LinkButton href="/signup" size="lg" className="gap-2">
          Try it free <ArrowRight className="size-4" />
        </LinkButton>
      </div>
    </div>
  );
}
