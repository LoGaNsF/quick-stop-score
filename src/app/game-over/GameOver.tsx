'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/store/game-store';

export function GameOver() {
  const router = useRouter();
  const state = useGameStore();
  const resetGame = useGameStore(s => s.resetGame);

  const winner = useMemo(
    () => state.players.find(player => player.id === state.winnerId) ?? null,
    [state.players, state.winnerId],
  );

  useEffect(() => {
    if (state.status === 'idle') {
      router.replace('/new-game');
    }
  }, [router, state.status]);

  const onResetGame = () => {
    resetGame();
    router.push('/new-game');
  };

  if (state.status === 'idle') return null;

  return (
    <AppShell title='Partida finalizada' subtitle='Tenemos un ganador.'>
      <Card>
        <CardHeader>
          <CardTitle>
            {winner ? `${winner.name} gana la partida` : 'Partida terminada'}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {winner ? (
            <p className='text-sm text-muted-foreground'>
              Alcanzó {winner.score} puntos y fue el primer jugador en llegar al
              objetivo.
            </p>
          ) : (
            <p className='text-sm text-muted-foreground'>
              No se pudo determinar un ganador con los datos actuales.
            </p>
          )}
          <div className='grid gap-2'>
            <Link
              href='/new-game'
              className={buttonVariants({ variant: 'default' })}
              onClick={onResetGame}
            >
              Nueva partida
            </Link>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
