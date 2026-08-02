interface Step {
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    title: "Bring a video",
    body: "Paste a YouTube URL or upload a file — no special format or editing required.",
  },
  {
    title: "Let the pipeline run",
    body: "Transcription, dubbing, and clip jobs run in the background. Watch progress update live.",
  },
  {
    title: "Export, dub, or chat",
    body: "Download subtitles, dubbed videos, and clips — or just ask your video a question.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-border bg-muted/20">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">How it works</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From raw footage to a finished asset, in three steps.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.title} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
              <span className="flex size-9 items-center justify-center rounded-full border border-border font-heading text-sm font-semibold text-brand">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
