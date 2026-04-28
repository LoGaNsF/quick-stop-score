export const dynamic = 'force-static';

import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';

export default function HomePage() {
  return (
    <AppShell
      title='Quick Stop Score'
      subtitle='Lleva la puntuación de cada partida en segundos.'
    >
      <Card>
        <CardContent className='pt-6'>
          <Link
            href='/new-game'
            className={buttonVariants({ size: 'lg', className: 'w-full' })}
          >
            Nueva partida
          </Link>
        </CardContent>
      </Card>
    </AppShell>
  );
}
