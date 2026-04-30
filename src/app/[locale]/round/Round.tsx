'use client';

import { useEffect } from 'react';

import { useTranslations } from 'next-intl';

import { useRouter } from '@/i18n/navigation';

import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { RoundControls } from '@/components/round-controls';
import { useGameStore } from '@/store/game-store';

export function Round() {
  const t = useTranslations();
  const router = useRouter();
  const state = useGameStore();
  const addRoundPoint = useGameStore(s => s.addRoundPoint);
  const removeRoundPoint = useGameStore(s => s.removeRoundPoint);
  const confirmRound = useGameStore(s => s.confirmRound);

  useEffect(() => {
    if (state.status === 'idle') {
      router.replace('/new-game');
      return;
    }
    if (state.status === 'finished') {
      router.replace('/game-over');
    }
  }, [router, state.status]);

  const onAddPoint = (playerId: string) => {
    addRoundPoint(playerId);
  };

  const onRemovePoint = (playerId: string) => {
    removeRoundPoint(playerId);
  };

  const onConfirmRound = () => {
    confirmRound();
    router.push('/game');
  };

  return (
    <AppShell
      title={t('round.title')}
      subtitle={t('round.subtitle')}
      footer={
        <Button
          className='w-full'
          size='lg'
          onClick={onConfirmRound}
          disabled={state.status !== 'in_progress'}
        >
          {t('round.confirm')}
        </Button>
      }
    >
      <RoundControls
        players={state.players}
        draft={state.roundDraft}
        onAddPoint={onAddPoint}
        onRemovePoint={onRemovePoint}
      />
    </AppShell>
  );
}
