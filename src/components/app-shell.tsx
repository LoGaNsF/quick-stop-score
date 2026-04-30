'use client';

import { cn } from '@/lib/utils';
import { House } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type AppShellProps = {
  title: string;
  subtitle?: string;
  showPageHeader?: boolean;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
};

export function AppShell({
  title,
  subtitle,
  showPageHeader = true,
  children,
  className,
  footer,
}: AppShellProps) {
  const pathname = usePathname();
  const isHome = pathname === '/' || /^\/[a-z]{2}$/.test(pathname);

  return (
    <div className='flex min-h-screen flex-col bg-background'>
      {/* Global sticky header */}
      <header className='sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm'>
        <div className='flex h-14 w-full items-center px-4'>
          {!isHome ? (
            <Link
              href='/'
              aria-label='Ir al inicio'
              className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground'
            >
              <House className='h-5 w-5' />
            </Link>
          ) : (
            <div className='h-9 w-9' />
          )}
        </div>
      </header>

      {/* Page content */}
      <main className='flex flex-1 flex-col px-4 py-6'>
        <div className={cn('mx-auto flex w-full max-w-md flex-1 flex-col', className)}>
          {showPageHeader ? (
            <div className='mb-6 space-y-1'>
              <h1 className='font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-foreground'>
                {title}
              </h1>
              {subtitle ? (
                <p className='text-sm text-muted-foreground'>{subtitle}</p>
              ) : null}
            </div>
          ) : null}
          <div className='flex-1'>{children}</div>
        </div>
      </main>

      {footer ? (
        <div className='sticky bottom-0 left-0 right-0 border-t border-border bg-background/95 px-4 py-4 backdrop-blur-sm'>
          <div className='mx-auto w-full max-w-md'>{footer}</div>
        </div>
      ) : null}
    </div>
  );
}
