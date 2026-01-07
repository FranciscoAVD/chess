"use client";
import { Board } from "@/components/board";
import { useGameStore } from "@/lib/stores/game-store";
export default function Home() {
  const validMoves = useGameStore((state) => state.validMoves);
  return (
    <main>
      <Board />
      <span>{validMoves.toString(16)}</span>
    </main>
  );
}
