// Server Component
import { cn } from '@/lib/utils';

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
};

export function AppShell({
  title,
  subtitle,
  children,
  className,
  footer,
}: AppShellProps) {
  return (
    <main className='flex min-h-screen flex-col bg-background px-4 py-6'>
      <div className={cn('mx-auto flex w-full max-w-md flex-1 flex-col', className)}>
        <header className='mb-6 space-y-1'>
          <h1 className='font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-foreground'>
            {title}
          </h1>
          {subtitle ? (
            <p className='text-sm text-muted-foreground'>{subtitle}</p>
          ) : null}
        </header>
        <div className='flex-1'>{children}</div>
      </div>
      {footer ? (
        <div className='sticky bottom-0 left-0 right-0 border-t border-border bg-background/95 px-4 py-4 backdrop-blur-sm'>
          <div className='mx-auto w-full max-w-md'>{footer}</div>
        </div>
      ) : null}
    </main>
  );
}
