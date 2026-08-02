import { AlertTriangle } from "lucide-react";

export function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

      <div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
        <p className="text-muted-foreground">
          This is a draft template describing how VideoLoom actually works today. It isn&rsquo;t
          legal advice — have it reviewed by a lawyer before relying on it.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-8">{children}</div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
