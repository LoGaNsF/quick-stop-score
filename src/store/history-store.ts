import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameHistoryEntry, Player } from '@/lib/game-types';

interface HistoryStore {
  games: GameHistoryEntry[];
  addGame: (players: Player[], winnerId: string | null, createdAt: number) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      games: [],
      addGame: (players, winnerId, createdAt) => {
        const winner = winnerId ? players.find(p => p.id === winnerId) : null;
        const entry: GameHistoryEntry = {
          id: `game-${Date.now()}`,
          players,
          winnerId,
          winnerName: winner?.name ?? null,
          createdAt,
          finishedAt: Date.now(),
        };
        set((state) => ({
          games: [entry, ...state.games].slice(0, 50), // Keep last 50 games
        }));
      },
      clearHistory: () => set({ games: [] }),
    }),
    {
      name: 'quick-stop-score:history',
    },
  ),
);
