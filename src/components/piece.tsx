"use client";
import { type Piece, useGameStore } from "@/lib/stores/game-store";
import { cn } from "@/lib/utils";

interface ChessPieceProps {
  tile: number;
  piece: Omit<Piece, "tile">;
}

function ChessPiece({ tile, piece }: ChessPieceProps) {
  const active = useGameStore((state) => state.activePiece);
  const setActive = useGameStore((state) => state.setActivePiece);

  return (
    <div
      className={cn(
        " flex items-center justify-center w-full h-full drop-shadow-sm font-bold select-none",
        piece.color === "white" ? "text-white" : "text-green-950",
        active === tile && "bg-lime-300 hover:bg-lime-300",
      )}
      onClick={() => setActive(active === tile ? null : tile)}
    >
      {piece.name}
    </div>
  );
}

export { ChessPiece };
