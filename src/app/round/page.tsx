"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { RoundControls } from "@/components/round-controls";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGame } from "@/context/game-context";

export default function RoundPage() {
  const router = useRouter();
  const { state, addRoundPoint, confirmRound, removeRoundPoint } = useGame();

  useEffect(() => {
    if (state.status === "idle") {
      router.replace("/new-game");
      return;
    }
    if (state.status === "finished") {
      router.replace("/game-over");
    }
  }, [router, state.status]);

  const onConfirmRound = () => {
    confirmRound();
    const winnerReached = state.players.some((player) => player.score + (state.roundDraft[player.id] ?? 0) >= 40);
    router.push(winnerReached ? "/game-over" : "/game");
  };

  return (
    <AppShell title="Siguiente ronda" subtitle="Suma puntos y confirma la ronda.">
      <RoundControls players={state.players} draft={state.roundDraft} onAddPoint={addRoundPoint} onRemovePoint={removeRoundPoint} />
      <Card>
        <CardContent className="pt-6">
          <Button className="w-full" size="lg" onClick={onConfirmRound}>
            Terminar
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
