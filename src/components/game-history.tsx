'use client';

import { useHistoryStore } from '@/store/history-store';
import { Trophy, Users, Clock, History } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

function formatRelativeTime(timestamp: number, locale: string): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (locale === 'es') {
    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days === 1) return 'Ayer';
    return `Hace ${days} días`;
  }

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export function GameHistory() {
  const t = useTranslations('history');
  const locale = useLocale();
  const games = useHistoryStore((state) => state.games);

  if (games.length === 0) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center py-16 text-center'>
        <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary'>
          <History className='h-8 w-8 text-muted-foreground' />
        </div>
        <h3 className='mb-1 text-lg font-medium text-foreground'>{t('empty')}</h3>
        <p className='max-w-[240px] text-sm text-muted-foreground'>
          {t('emptyDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <History className='h-4 w-4' />
        <span>{t('title')}</span>
      </div>
      <div className='space-y-2'>
        {games.map((game) => (
          <article
            key={game.id}
            className='group rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30'
          >
            <div className='flex items-start justify-between gap-3'>
              <div className='min-w-0 flex-1'>
                <div className='mb-2 flex items-center gap-2'>
                  {game.winnerName ? (
                    <>
                      <Trophy className='h-4 w-4 shrink-0 text-primary' />
                      <span className='truncate font-medium text-foreground'>
                        {game.winnerName}
                      </span>
                    </>
                  ) : (
                    <span className='text-muted-foreground'>{t('noWinner')}</span>
                  )}
                </div>
                <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground'>
                  <div className='flex items-center gap-1'>
                    <Users className='h-3 w-3' />
                    <span>
                      {game.players.length} {t('players')}
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Clock className='h-3 w-3' />
                    <span>{formatRelativeTime(game.finishedAt, locale)}</span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-end gap-1'>
                {game.players
                  .slice()
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 3)
                  .map((player, idx) => (
                    <div
                      key={player.id}
                      className='flex items-center gap-2 text-xs'
                    >
                      <span className='text-muted-foreground'>{player.name}</span>
                      <span
                        className={
                          idx === 0
                            ? 'font-semibold text-primary'
                            : 'text-muted-foreground'
                        }
                      >
                        {player.score}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
