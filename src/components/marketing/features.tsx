import { Captions, Check, Languages, ListVideo, MessageSquare, Scissors, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
}

const FEATURES: Feature[] = [
  {
    icon: Captions,
    eyebrow: "Transcription",
    title: "Accurate transcripts in seconds — not hours",
    body: "Drop in a YouTube link or upload a file. VideoLoom transcribes it with word-level timestamps, auto-detects the spoken language, and hands you clean, exportable text the moment it's done.",
    bullets: [
      "YouTube URL or direct file upload",
      "Timestamped segments, not just raw text",
      "Export subtitles as SRT or WebVTT",
      "Runs in the background — no waiting on a spinner",
    ],
  },
  {
    icon: Languages,
    eyebrow: "AI Dubbing",
    title: "Speak six languages without saying a word",
    body: "Take any completed transcript and dub it into English, Urdu, Hindi, Chinese, German, or Spanish with natural AI voices — plus a matching subtitle track in the dubbed language.",
    bullets: [
      "Natural neural voice per language",
      "Context-aware translation, not word-for-word",
      "Optional burned-in or toggleable subtitles",
      "Signed download links, ready to share",
    ],
  },
  {
    icon: Scissors,
    eyebrow: "AI Clips",
    title: "Auto-cut vertical shorts worth sharing",
    body: "VideoLoom finds the moments most likely to land and renders vertical 9:16 clips with animated captions — from the original video or an already-dubbed one.",
    bullets: [
      "Up to 5 clips per video",
      "Animated, auto-synced captions baked in",
      "Works on dubbed videos in any supported language",
      "Steer it with a topic — it'll make sure a clip covers it",
    ],
  },
  {
    icon: MessageSquare,
    eyebrow: "AI Video Chat",
    title: "Ask your video anything",
    body: "Every transcript becomes something you can talk to. Ask for a summary, pull a quote, or find exactly where a topic came up — answers stream back in real time.",
    bullets: [
      "Real-time streamed replies",
      "Full conversation history saved per video",
      "Long chats auto-summarized to stay sharp",
      "No re-uploading — works straight off the transcript",
    ],
  },
  {
    icon: ListVideo,
    eyebrow: "Playlists",
    title: "Keep every asset organized your way",
    body: "Group any mix of transcriptions, dubs, and clips into named playlists, reorder them by drag-and-drop, and label each item — built for juggling more than one project.",
    bullets: [
      "Mix transcripts, dubs & clips in one playlist",
      "Drag-and-drop reordering",
      "Custom labels per item",
      "Unlimited playlists",
    ],
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl scroll-mt-20 px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything you need to repurpose a video
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Five tools, one pipeline — transcribe, dub, clip, chat, and organize without leaving
          VideoLoom.
        </p>
      </div>

      <div className="mt-20 flex flex-col gap-24">
        {FEATURES.map((feature, index) => (
          <FeatureRow key={feature.eyebrow} feature={feature} reverse={index % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function FeatureRow({ feature, reverse }: { feature: Feature; reverse: boolean }) {
  const Icon = feature.icon;
  return (
    <div className={cn("grid items-center gap-12 lg:grid-cols-2", reverse && "lg:[&>*:first-child]:order-2")}>
      <div className="flex flex-col items-start gap-5">
        <span className="flex size-11 items-center justify-center rounded-md bg-foreground text-background">
          <Icon className="size-5" />
        </span>
        <span className="text-sm font-semibold tracking-wide text-brand uppercase">{feature.eyebrow}</span>
        <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{feature.title}</h3>
        <p className="text-muted-foreground">{feature.body}</p>
        <ul className="flex flex-col gap-2.5">
          {feature.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2.5 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-brand" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <FeatureVisual icon={Icon} />
    </div>
  );
}

function FeatureVisual({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/40">
      <Icon className="size-16 text-muted-foreground" strokeWidth={1} />
    </div>
  );
}
