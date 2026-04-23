import { applyRound, getWinnerFromRound, isGameOver, WIN_SCORE } from "@/lib/game-rules";
import type { Player } from "@/lib/game-types";

const players: Player[] = [
  { id: "p1", name: "Ana", score: 39 },
  { id: "p2", name: "Luis", score: 12 }
];

describe("game-rules", () => {
  it("detects game over when a player reaches 40", () => {
    const updated = applyRound(players, { p1: 1, p2: 0 });
    expect(isGameOver(updated)).toBe(true);
    expect(updated[0].score).toBe(WIN_SCORE);
  });

  it("returns first player that reaches 40 in player order", () => {
    const winner = getWinnerFromRound(
      [
        { id: "p1", name: "Ana", score: 39 },
        { id: "p2", name: "Luis", score: 39 }
      ],
      { p1: 2, p2: 4 }
    );
    expect(winner?.id).toBe("p1");
  });
});
