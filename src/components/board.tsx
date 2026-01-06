"use client";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/lib/stores/game-store";

function getRowStart(num: number) {
  switch (num) {
    case 0: {
      return "row-start-8";
    }
    case 1: {
      return "row-start-7";
    }
    case 2: {
      return "row-start-6";
    }
    case 3: {
      return "row-start-5";
    }
    case 4: {
      return "row-start-4";
    }
    case 5: {
      return "row-start-3";
    }
    case 6: {
      return "row-start-2";
    }
    case 7: {
      return "row-start-1";
    }
    default: {
      return null;
    }
  }
}

function Board() {
  const pieceAtIdx = useGameStore((state) => state.getPieceAtIdx);
  return (
    <div className="grid grid-cols-8 grid-rows-8 aspect-square max-w-xl">
      {Array.from({ length: 64 }, (_, idx) => {
        // Calculate chess coordinates
        const row = Math.floor(idx / 8);
        const col = idx % 8;
        const isDark = (row + col) % 2 === 0;
        const rowStart = getRowStart(Math.floor(idx / 8));
        const piece = pieceAtIdx(idx);
        return (
          <div
            key={idx}
            className={cn(
              "relative flex items-center justify-center aspect-square transition",
              isDark
                ? "bg-[#779556] hover:bg-stone-400"
                : "bg-[#ebecd0] hover:bg-stone-400",
              rowStart,
            )}
          >
            {piece && (
              <span
                className={cn(
                  "drop-shadow-sm font-bold",
                  piece.color === "white" ? "text-white" : "text-green-950",
                )}
              >
                {piece.symbol}
              </span>
            )}
            {/* 2. Render Piece */}
            <span className="absolute text-xs bottom-1 right-2">{idx}</span>
          </div>
        );
      })}
    </div>
  );
}
export { Board };
