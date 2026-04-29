'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useRouter } from '@/i18n/navigation';
import { AppShell } from '@/components/app-shell';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/store/game-store';

export function GameOver() {
  const t = useTranslations();
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
    <AppShell title={t('gameover.title')} subtitle={t('gameover.subtitle')}>
      <Card>
        <CardHeader>
          <CardTitle>
            {winner
              ? t('gameover.winner', { name: winner.name })
              : t('gameover.noWinner')}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {winner ? (
            <p className='text-sm text-muted-foreground'>
              {t('gameover.winnerDesc', { score: winner.score })}
            </p>
          ) : (
            <p className='text-sm text-muted-foreground'>
              {t('gameover.noWinnerDesc')}
            </p>
          )}
          <div className='grid gap-2'>
            <Link
              href='/new-game'
              className={buttonVariants({ variant: 'default' })}
              onClick={onResetGame}
            >
              {t('newgame.title')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
