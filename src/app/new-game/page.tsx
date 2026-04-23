"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGame } from "@/context/game-context";

export default function NewGamePage() {
  const router = useRouter();
  const { createGame } = useGame();
  const [draftName, setDraftName] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [error, setError] = useState("");

  const canStart = players.length > 0;
  const normalizedPlayers = useMemo(() => new Set(players.map((name) => name.trim().toLowerCase())), [players]);

  const addPlayer = () => {
    const trimmed = draftName.trim();
    if (!trimmed) {
      setError("Introduce un nombre válido.");
      return;
    }
    if (normalizedPlayers.has(trimmed.toLowerCase())) {
      setError("Ese jugador ya fue añadido.");
      return;
    }
    setPlayers((prev) => [...prev, trimmed]);
    setDraftName("");
    setError("");
  };

  const startGame = () => {
    if (!canStart) return;
    createGame(players);
    router.push("/game");
  };

  return (
    <AppShell title="Nueva partida" subtitle="Añade jugadores para comenzar.">
      <Card>
        <CardHeader>
          <CardTitle>Jugadores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="player-name">Nombre</Label>
            <div className="flex gap-2">
              <Input
                id="player-name"
                value={draftName}
                placeholder="Ej. Ana"
                onChange={(event) => setDraftName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addPlayer();
                  }
                }}
              />
              <Button type="button" onClick={addPlayer}>
                Añadir
              </Button>
            </div>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="space-y-2">
            {players.length === 0 ? (
              <p className="text-sm text-muted-foreground">Todavía no hay jugadores.</p>
            ) : (
              players.map((player) => (
                <div key={player} className="rounded-lg border border-border bg-white px-3 py-2 text-sm">
                  {player}
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" onClick={startGame} disabled={!canStart}>
            Comenzar
          </Button>
        </CardFooter>
      </Card>
    </AppShell>
  );
}
