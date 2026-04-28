export type Player = {
  id: string;
  name: string;
  score: number;
};

export type GameStatus = 'idle' | 'in_progress' | 'finished';

export type GameState = {
  players: Player[];
  status: GameStatus;
  winnerId: string | null;
  roundDraft: Record<string, number>;
  createdAt: number | null;
};

export type RoundDelta = Record<string, number>;
