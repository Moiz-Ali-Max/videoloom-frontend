import { Logo } from "@/components/shared/logo";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-grid-fade px-6 py-16">
      <Logo />
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex flex-col gap-1.5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {children}
      </div>
      {footer && <div className="text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
}
