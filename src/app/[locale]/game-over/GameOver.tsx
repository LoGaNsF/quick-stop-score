'use client';

import { useEffect, useMemo, useRef } from 'react';

import { useTranslations } from 'next-intl';
import { Trophy, Home, RotateCcw } from 'lucide-react';

import { Link, useRouter } from '@/i18n/navigation';

import { AppShell } from '@/components/app-shell';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGameStore } from '@/store/game-store';
import { useHistoryStore } from '@/store/history-store';

export function GameOver() {
  const t = useTranslations();
  const router = useRouter();
  const state = useGameStore();
  const resetGame = useGameStore(s => s.resetGame);
  const addGame = useHistoryStore(s => s.addGame);
  const savedRef = useRef(false);

  const winner = useMemo(
    () => state.players.find(player => player.id === state.winnerId) ?? null,
    [state.players, state.winnerId],
  );

  const sortedPlayers = useMemo(
    () => [...state.players].sort((a, b) => b.score - a.score),
    [state.players],
  );

  // Save to history when game is finished
  useEffect(() => {
    if (state.status === 'finished' && state.createdAt && !savedRef.current) {
      savedRef.current = true;
      addGame(state.players, state.winnerId, state.createdAt);
    }
  }, [state.status, state.players, state.winnerId, state.createdAt, addGame]);

  useEffect(() => {
    if (state.status === 'idle') {
      router.replace('/new-game');
    }
  }, [router, state.status]);

  const onResetGame = () => {
    resetGame();
    router.push('/new-game');
  };

  const onGoHome = () => {
    resetGame();
    router.push('/');
  };

  if (state.status === 'idle') return null;

  return (
    <AppShell title={t('gameover.title')} subtitle={t('gameover.subtitle')}>
      <div className='space-y-4'>
        {/* Winner Card */}
        <Card className='border-primary/30 bg-gradient-to-br from-card to-primary/5'>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center text-center'>
              <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20'>
                <Trophy className='h-8 w-8 text-primary' />
              </div>
              <h2 className='mb-1 font-[family-name:var(--font-display)] text-xl font-bold text-foreground'>
                {winner
                  ? t('gameover.winner', { name: winner.name })
                  : t('gameover.noWinner')}
              </h2>
              {winner ? (
                <p className='text-sm text-muted-foreground'>
                  {t('gameover.winnerDesc', { score: winner.score })}
                </p>
              ) : (
                <p className='text-sm text-muted-foreground'>
                  {t('gameover.noWinnerDesc')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scoreboard */}
        <Card>
          <CardContent className='pt-6'>
            <div className='space-y-2'>
              {sortedPlayers.map((player, idx) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                    idx === 0
                      ? 'bg-primary/10 text-primary'
                      : 'bg-secondary text-foreground'
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <span className='flex h-6 w-6 items-center justify-center rounded-full bg-background text-xs font-medium'>
                      {idx + 1}
                    </span>
                    <span className='font-medium'>{player.name}</span>
                  </div>
                  <span className='font-semibold'>{player.score}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className='grid grid-cols-2 gap-3'>
          <button
            onClick={onGoHome}
            className={buttonVariants({ variant: 'secondary', className: 'gap-2' })}
          >
            <Home className='h-4 w-4' />
            {t('home.title')}
          </button>
          <button
            onClick={onResetGame}
            className={buttonVariants({ variant: 'default', className: 'gap-2' })}
          >
            <RotateCcw className='h-4 w-4' />
            {t('newgame.title')}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
