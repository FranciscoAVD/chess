"use client";

import { Tile } from "./tile";
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
  const validMoves = useGameStore((state) => state.validMoves);
  return (
    <div className="grid grid-cols-8 grid-rows-8 aspect-square max-w-xl">
      {Array.from({ length: 64 }, (_, idx) => {
        // Calculate chess coordinates
        const row = Math.floor(idx / 8);
        const col = idx % 8;
        const isDark = (row + col) % 2 === 0;
        const rowStart = getRowStart(Math.floor(idx / 8)) ?? "";
        const canMoveTo = Boolean((validMoves >> BigInt(idx)) & 1n);
        return (
          <Tile
            key={idx}
            tile={idx}
            isDark={isDark}
            canMove={canMoveTo}
            className={rowStart}
          />
        );
      })}
    </div>
  );
}
export { Board };
