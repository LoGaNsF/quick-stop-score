'use client';

import { useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';

import { useRouter } from '@/i18n/navigation';

import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGameStore } from '@/store/game-store';

export function NewGame() {
  const t = useTranslations();
  const router = useRouter();
  const [draftName, setDraftName] = useState('');
  const [players, setPlayers] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const createGame = useGameStore(s => s.createGame);

  const canStart = players.length > 0;
  const normalizedPlayers = useMemo(
    () => new Set(players.map(name => name.trim().toLowerCase())),
    [players],
  );

  const addPlayer = () => {
    const trimmed = draftName.trim();
    if (!trimmed) {
      setError(t('newgame.invalidName'));
      return;
    }
    if (normalizedPlayers.has(trimmed.toLowerCase())) {
      setError(t('newgame.duplicatePlayer'));
      return;
    }
    setPlayers(prev => [...prev, trimmed]);
    setDraftName('');
    setError('');
  };

  const startGame = async () => {
    if (!canStart) return;
    setLoading(true);
    try {
      const gameState = createGame(players);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          'quick-stop-score:game',
          JSON.stringify(gameState),
        );
      }
      router.push('/game');
    } catch (e) {
      setError(t('newgame.errorCreatingGame'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title={t('newgame.title')}
      subtitle={t('newgame.subtitle')}
      footer={
        <Button className='w-full' size='lg' onClick={startGame} disabled={!canStart || loading}>
          {loading ? t('newgame.creating') : t('newgame.start')}
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('newgame.players')}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='space-y-2'>
            <Label htmlFor='player-name'>{t('newgame.name')}</Label>
            <div className='flex gap-2'>
              <Input
                id='player-name'
                value={draftName}
                placeholder={t('newgame.placeholder')}
                onChange={event => setDraftName(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addPlayer();
                  }
                }}
              />
              <Button type='button' onClick={addPlayer}>
                {t('newgame.add')}
              </Button>
            </div>
          </div>
          {error ? <p className='text-sm text-destructive'>{error}</p> : null}
          <div className='space-y-2'>
            {players.length === 0 ? (
              <p className='text-sm text-muted-foreground'>
                {t('newgame.noPlayers')}
              </p>
            ) : (
              players.map(player => (
                <div
                  key={player}
                  className='rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground'
                >
                  {player}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
