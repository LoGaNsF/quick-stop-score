import { Minus, Plus } from 'lucide-react';
import type { Player, RoundDelta } from '@/lib/game-types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type RoundControlsProps = {
  players: Player[];
  draft: RoundDelta;
  onAddPoint: (playerId: string) => void;
  onRemovePoint: (playerId: string) => void;
};

// Server Component
export function RoundControls({
  players,
  draft,
  onAddPoint,
  onRemovePoint,
}: RoundControlsProps) {
  return (
    <Card className='p-4'>
      <div className='space-y-3'>
        {players.map((player, index) => (
          <div key={player.id}>
            <div className='flex items-center justify-between gap-3'>
              <div>
                <p className='font-medium'>{player.name}</p>
                <p className='text-sm text-muted-foreground'>
                  Total: {player.score}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <span className='min-w-8 text-right font-semibold'>
                  +{draft[player.id] ?? 0}
                </span>
                <Button
                  size='icon'
                  variant='outline'
                  onClick={() => onRemovePoint(player.id)}
                  aria-label={`Restar punto a ${player.name}`}
                >
                  <Minus className='h-4 w-4' />
                </Button>
                <Button
                  size='icon'
                  onClick={() => onAddPoint(player.id)}
                  aria-label={`Sumar punto a ${player.name}`}
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
            </div>
            {index < players.length - 1 ? <Separator className='mt-3' /> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
