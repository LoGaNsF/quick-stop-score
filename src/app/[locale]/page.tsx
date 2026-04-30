import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';

import { Link } from '@/i18n/navigation';

import { AppShell } from '@/components/app-shell';
import { GameHistory } from '@/components/game-history';
import { buttonVariants } from '@/components/ui/button';

export default function HomePage() {
  const t = useTranslations();

  return (
    <AppShell
      title={t('home.title')}
      subtitle={t('home.subtitle')}
      showPageHeader={false}
      footer={
        <Link
          href='/new-game'
          className={buttonVariants({
            size: 'lg',
            className: 'w-full gap-2 font-semibold',
          })}
        >
          <Plus className='h-5 w-5' />
          {t('newgame.title')}
        </Link>
      }
    >
      <GameHistory />
    </AppShell>
  );
}
