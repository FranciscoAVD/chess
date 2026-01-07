"use client";

import { cn } from "@/lib/utils";
import { useGameStore } from "@/lib/stores/game-store";
import { ChessPiece } from "./piece";

interface TileProps extends React.ComponentProps<"div"> {
  isDark: boolean;
  tile: number;
  canMove: boolean;
}

function Tile({ isDark, canMove, tile, className, ...props }: TileProps) {
  const getPiece = useGameStore((state) => state.getPieceAtTile);
  const piece = getPiece(tile);

  return (
    <div
      className={cn(
        "relative aspect-square transition",
        isDark
          ? "bg-[#779556] hover:bg-stone-400"
          : "bg-[#ebecd0] hover:bg-stone-400",
        className,
      )}
      {...props}
    >
      {piece && <ChessPiece tile={tile} piece={piece} />}
      {canMove && (
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] size-3 bg-lime-100 border-3 border-lime-500 rounded-full" />
      )}
      <span className="absolute text-xs bottom-1 right-2">{tile}</span>
    </div>
  );
}

export { Tile };
