import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameProvider, useGame } from "@/context/game-context";

function FlowProbe() {
  const { state, createGame, addRoundPoint, confirmRound } = useGame();

  return (
    <div>
      <button onClick={() => createGame(["Ana", "Luis"])}>create</button>
      <button
        onClick={() => {
          const first = state.players[0];
          if (!first) return;
          for (let i = 0; i < 40; i += 1) {
            addRoundPoint(first.id);
          }
        }}
      >
        points
      </button>
      <button onClick={confirmRound}>confirm</button>
      <p data-testid="status">{state.status}</p>
      <p data-testid="winner">{state.winnerId ?? "none"}</p>
      <p data-testid="score">{state.players[0]?.score ?? 0}</p>
    </div>
  );
}

describe("game flow", () => {
  it("creates game, applies round points and finishes with winner", async () => {
    const user = userEvent.setup();
    render(
      <GameProvider>
        <FlowProbe />
      </GameProvider>
    );

    await user.click(screen.getByRole("button", { name: "create" }));
    await user.click(screen.getByRole("button", { name: "points" }));
    await user.click(screen.getByRole("button", { name: "confirm" }));

    expect(screen.getByTestId("status")).toHaveTextContent("finished");
    expect(screen.getByTestId("winner")).not.toHaveTextContent("none");
    expect(screen.getByTestId("score")).toHaveTextContent("40");
  });
});
