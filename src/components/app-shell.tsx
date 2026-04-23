import { cn } from "@/lib/utils";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
};

export function AppShell({ title, subtitle, children, className }: AppShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className={cn("mx-auto w-full max-w-md space-y-5", className)}>
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </header>
        {children}
      </div>
    </main>
  );
}
