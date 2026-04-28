import type { Player, RoundDelta } from '@/lib/game-types';

export const WIN_SCORE = 40;

export function isGameOver(players: Player[]): boolean {
  return players.some(player => player.score >= WIN_SCORE);
}

export function applyRound(players: Player[], draft: RoundDelta): Player[] {
  return players.map(player => ({
    ...player,
    score: player.score + (draft[player.id] ?? 0),
  }));
}

export function getWinnerFromRound(
  playersBeforeRound: Player[],
  roundDraft: RoundDelta,
): Player | null {
  for (const player of playersBeforeRound) {
    const nextScore = player.score + (roundDraft[player.id] ?? 0);
    if (nextScore >= WIN_SCORE) {
      return { ...player, score: nextScore };
    }
  }
  return null;
}
