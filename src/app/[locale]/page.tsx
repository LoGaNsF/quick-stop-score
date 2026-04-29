import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

import { AppShell } from '@/components/app-shell';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const t = useTranslations();

  return (
    <AppShell title={t('home.title')} subtitle={t('home.subtitle')}>
      <Card>
        <CardContent className='pt-6'>
          <Link
            href='/new-game'
            className={buttonVariants({ size: 'lg', className: 'w-full' })}
          >
            {t('newgame.title')}
          </Link>
        </CardContent>
      </Card>
    </AppShell>
  );
}
