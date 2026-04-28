import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Player, RoundDelta } from '@/lib/game-types';

function buildRoundDraft(players: Player[]): RoundDelta {
  return players.reduce<RoundDelta>((acc, player) => {
    acc[player.id] = 0;
    return acc;
  }, {} as RoundDelta);
}

interface GameStore extends GameState {
  createGame: (names: string[]) => void;
  startRound: () => void;
  addRoundPoint: (playerId: string) => void;
  removeRoundPoint: (playerId: string) => void;
  confirmRound: () => void;
  resetGame: () => void;
}

const initialState: GameState = {
  players: [],
  status: 'idle',
  winnerId: null,
  roundDraft: {},
  createdAt: null,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      createGame: names => {
        const players = names.map((name, i) => ({
          id: `player-${i + 1}-${Date.now()}`,
          name,
          score: 0,
        }));
        set({
          players,
          status: 'in_progress',
          winnerId: null,
          roundDraft: buildRoundDraft(players),
          createdAt: Date.now(),
        });
      },
      startRound: () => {
        if (get().status !== 'in_progress') return;
        set({ roundDraft: buildRoundDraft(get().players) });
      },
      addRoundPoint: playerId => {
        if (get().status !== 'in_progress') return;
        set(state => ({
          roundDraft: {
            ...state.roundDraft,
            [playerId]: (state.roundDraft[playerId] ?? 0) + 1,
          },
        }));
      },
      removeRoundPoint: playerId => {
        if (get().status !== 'in_progress') return;
        set(state => ({
          roundDraft: {
            ...state.roundDraft,
            [playerId]: Math.max((state.roundDraft[playerId] ?? 0) - 1, 0),
          },
        }));
      },
      confirmRound: () => {
        const state = get();
        if (state.status !== 'in_progress') return;

        const updatedPlayers = state.players.map(player => ({
          ...player,
          score: player.score + (state.roundDraft[player.id] ?? 0),
        }));

        const winner = updatedPlayers.find(p => p.score >= 40) || null;

        set({
          players: updatedPlayers,
          roundDraft: buildRoundDraft(updatedPlayers),
          status: winner ? 'finished' : 'in_progress',
          winnerId: winner ? winner.id : null,
        });
      },
      resetGame: () => set(initialState),
    }),
    {
      name: 'quick-stop-score:game',
    },
  ),
);
