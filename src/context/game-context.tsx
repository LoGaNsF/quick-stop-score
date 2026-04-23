"use client";

import { createContext, useContext, useMemo, useReducer } from "react";
import { applyRound, getWinnerFromRound, isGameOver } from "@/lib/game-rules";
import type { GameState, Player, RoundDelta } from "@/lib/game-types";

type CreateGamePayload = {
  names: string[];
};

type GameAction =
  | { type: "CREATE_GAME"; payload: CreateGamePayload }
  | { type: "START_ROUND" }
  | { type: "ADD_ROUND_POINT"; payload: { playerId: string } }
  | { type: "REMOVE_ROUND_POINT"; payload: { playerId: string } }
  | { type: "CONFIRM_ROUND" }
  | { type: "RESET_GAME" };

const initialState: GameState = {
  players: [],
  status: "idle",
  winnerId: null,
  roundDraft: {},
  createdAt: null
};

function buildRoundDraft(players: Player[]): RoundDelta {
  return players.reduce<RoundDelta>((acc, player) => {
    acc[player.id] = 0;
    return acc;
  }, {});
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "CREATE_GAME": {
      const players = action.payload.names.map((name, index) => ({
        id: `player-${index + 1}-${Date.now()}`,
        name,
        score: 0
      }));
      return {
        players,
        status: "in_progress",
        winnerId: null,
        roundDraft: buildRoundDraft(players),
        createdAt: Date.now()
      };
    }
    case "START_ROUND": {
      if (state.status !== "in_progress") return state;
      return {
        ...state,
        roundDraft: buildRoundDraft(state.players)
      };
    }
    case "ADD_ROUND_POINT": {
      if (state.status !== "in_progress") return state;
      const nextDraft = { ...state.roundDraft };
      nextDraft[action.payload.playerId] = (nextDraft[action.payload.playerId] ?? 0) + 1;
      return {
        ...state,
        roundDraft: nextDraft
      };
    }
    case "REMOVE_ROUND_POINT": {
      if (state.status !== "in_progress") return state;
      if (state.roundDraft[action.payload.playerId] === 0) return state;
      const nextDraft = { ...state.roundDraft };
      nextDraft[action.payload.playerId] = (nextDraft[action.payload.playerId] ?? 0) - 1;
      return {
        ...state,
        roundDraft: nextDraft
      };
    }
    case "CONFIRM_ROUND": {
      if (state.status !== "in_progress") return state;
      const winner = getWinnerFromRound(state.players, state.roundDraft);
      const players = applyRound(state.players, state.roundDraft);
      const ended = winner !== null || isGameOver(players);
      return {
        ...state,
        players,
        status: ended ? "finished" : "in_progress",
        winnerId: winner?.id ?? state.winnerId,
        roundDraft: buildRoundDraft(players)
      };
    }
    case "RESET_GAME":
      return initialState;
    default:
      return state;
  }
}

type GameContextValue = {
  state: GameState;
  createGame: (names: string[]) => void;
  startRound: () => void;
  addRoundPoint: (playerId: string) => void;
  removeRoundPoint: (playerId: string) => void;
  confirmRound: () => void;
  resetGame: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      createGame: (names) => dispatch({ type: "CREATE_GAME", payload: { names } }),
      startRound: () => dispatch({ type: "START_ROUND" }),
      addRoundPoint: (playerId) => dispatch({ type: "ADD_ROUND_POINT", payload: { playerId } }),
      removeRoundPoint: (playerId) => dispatch({ type: "REMOVE_ROUND_POINT", payload: { playerId } }),
      confirmRound: () => dispatch({ type: "CONFIRM_ROUND" }),
      resetGame: () => dispatch({ type: "RESET_GAME" })
    }),
    [state]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}
