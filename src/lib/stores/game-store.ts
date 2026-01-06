import { create } from "zustand";
import { KNIGHT_LUT } from "@/lib/lut";

const pieces = ["pawn", "knight", "bishop", "rook", "queen", "king"] as const;
interface GameStore {
  gameState: BigUint64Array;
  getValidMoves: (
    name: (typeof pieces)[number],
    tile: number,
    color: "white" | "black",
  ) => void;
}

const useGameStore = create<GameStore>((set, get) => ({
  gameState: new BigUint64Array([
    /*White*/
    0x00_00_00_00_00_00_ff_00n, //pawns
    0x00_00_00_00_00_00_00_42n, //knights
    0x00_00_00_00_00_00_00_24n, //bishops
    0x00_00_00_00_00_00_00_81n, //rooks
    0x00_00_00_00_00_00_00_08n, //queen
    0x00_00_00_00_00_00_00_10n, //king
    /*Black*/
    0x00_ff_00_00_00_00_00_00n, //pawns
    0x42_00_00_00_00_00_00_00n, //knights
    0x24_00_00_00_00_00_00_00n, //bishops
    0x81_00_00_00_00_00_00_00n, //rooks
    0x08_00_00_00_00_00_00_00n, //queen
    0x10_00_00_00_00_00_00_00n, //king
  ]),
  getValidMoves: (name, tile, color) => {
    switch (name) {
      case "pawn": {
      }
      case "knight": {
      }
      case "bishop": {
      }
      case "rook": {
      }
      case "queen": {
      }
      case "king": {
      }
    }
    return;
  },
}));

export { useGameStore };
