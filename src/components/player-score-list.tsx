import type { Player } from '@/lib/game-types';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type PlayerScoreListProps = {
  players: Player[];
};

export function PlayerScoreList({ players }: PlayerScoreListProps) {
  return (
    <Card className='p-4'>
      <div className='space-y-3'>
        {players.map((player, index) => (
          <div key={player.id}>
            <div className='flex items-center justify-between'>
              <p className='font-medium text-foreground'>{player.name}</p>
              <p className='text-lg font-semibold'>{player.score}</p>
            </div>
            {index < players.length - 1 ? <Separator className='mt-3' /> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
