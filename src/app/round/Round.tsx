'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { RoundControls } from '@/components/round-controls';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGameStore } from '@/store/game-store';

export function Round() {
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
      title='Siguiente ronda'
      subtitle='Suma puntos y confirma la ronda.'
    >
      <RoundControls
        players={state.players}
        draft={state.roundDraft}
        onAddPoint={onAddPoint}
        onRemovePoint={onRemovePoint}
      />
      <Card>
        <CardContent className='pt-6'>
          <Button
            className='w-full'
            size='lg'
            onClick={onConfirmRound}
            disabled={state.status !== 'in_progress'}
          >
            Confirmar ronda
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
