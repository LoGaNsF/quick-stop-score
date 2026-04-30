'use client';

import { useEffect } from 'react';

import { useTranslations } from 'next-intl';

import { useRouter } from '@/i18n/navigation';

import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { PlayerScoreList } from '@/components/player-score-list';
import { useGameStore } from '@/store/game-store';

export function Game() {
  const t = useTranslations();
  const router = useRouter();
  const state = useGameStore();
  const startRound = useGameStore(s => s.startRound);

  useEffect(() => {
    if (state.status === 'idle') {
      router.replace('/new-game');
      return;
    }
    if (state.status === 'finished') {
      router.replace('/game-over');
    }
  }, [router, state.status]);

  const onNextRound = () => {
    startRound();
    router.push('/round');
  };

  return (
    <AppShell
      title={t('game.title')}
      subtitle={t('game.subtitle')}
      footer={
        <Button
          className='w-full'
          size='lg'
          onClick={onNextRound}
          disabled={state.status !== 'in_progress'}
        >
          {t('round.title')}
        </Button>
      }
    >
      <PlayerScoreList players={state.players} />
    </AppShell>
  );
}
