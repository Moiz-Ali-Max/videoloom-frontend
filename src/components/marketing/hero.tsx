import { ArrowRight, Captions, Check, Languages, Scissors, type LucideIcon } from "lucide-react";
import { LinkButton } from "@/components/shared/link-button";

const WAVEFORM = [14, 22, 30, 18, 26, 34, 20, 28, 16, 24, 32, 20, 14, 22, 28, 18, 24, 30, 20, 16];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid-fade">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 pt-20 pb-24 lg:grid-cols-2 lg:items-center lg:pt-28 lg:pb-32">
        <div className="flex flex-col items-start gap-6">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Video transcription, dubbing &amp; clipping
          </p>

          <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl lg:text-[3.25rem]">
            Turn one video into a <span className="text-brand">whole content pipeline</span>
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground">
            Paste a YouTube link or upload a file. VideoLoom transcribes it, dubs it into six
            languages, cuts vertical shorts, and lets you chat with the content — all from one
            dashboard.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/signup" size="lg" className="gap-2">
              Get started free <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton href="#features" variant="outline" size="lg">
              See how it works
            </LinkButton>
          </div>

          <p className="text-xs text-muted-foreground">No credit card required.</p>
        </div>

        <HeroMockup />
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-xl">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
          <Captions className="size-4.5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">product-launch-keynote.mp4</p>
          <p className="text-xs text-muted-foreground">18:42 · Completed</p>
        </div>
      </div>

      <div className="flex items-end gap-0.5 py-6">
        {WAVEFORM.map((h, i) => (
          <span key={i} className="w-1.5 rounded-full bg-foreground/25" style={{ height: `${h}px` }} />
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        <MockRow icon={Captions} label="Transcript ready" detail="2,140 words · EN" />
        <MockRow icon={Languages} label="Dubbed to Spanish" detail="Voice: Elvira" />
        <MockRow icon={Scissors} label="4 clips generated" detail="9:16 · captioned" />
      </div>
    </div>
  );
}

function MockRow({ icon: Icon, label, detail }: { icon: LucideIcon; label: string; detail: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{label}</p>
        <p className="truncate text-xs text-muted-foreground">{detail}</p>
      </div>
      <Check className="size-4 shrink-0 text-brand" />
    </div>
  );
}
