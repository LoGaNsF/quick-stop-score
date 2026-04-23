"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { PlayerScoreList } from "@/components/player-score-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGame } from "@/context/game-context";

export default function GamePage() {
  const router = useRouter();
  const { state, startRound } = useGame();

  useEffect(() => {
    if (state.status === "idle") {
      router.replace("/new-game");
      return;
    }
    if (state.status === "finished") {
      router.replace("/game-over");
    }
  }, [router, state.status]);

  const onNextRound = () => {
    startRound();
    router.push("/round");
  };

  return (
    <AppShell title="Partida en curso" subtitle="Puntuación acumulada de los jugadores.">
      <PlayerScoreList players={state.players} />
      <Card>
        <CardContent className="pt-6">
          <Button className="w-full" size="lg" onClick={onNextRound} disabled={state.status !== "in_progress"}>
            Siguiente ronda
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
