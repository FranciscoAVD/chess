import { create } from "zustand";
import { KNIGHT_LUT } from "@/lib/lut";

const DEFAULT_GAME_STATE = [
  /**********White**********/
  0x00_00_00_00_00_00_ff_00n, //pawns
  0x00_00_00_00_00_00_00_42n, //knights
  0x00_00_00_00_00_00_00_24n, //bishops
  0x00_00_00_00_00_00_00_81n, //rooks
  0x00_00_00_00_00_00_00_08n, //queen
  0x00_00_00_00_00_00_00_10n, //king
  /**********Black**********/
  0x00_ff_00_00_00_00_00_00n, //pawns
  0x42_00_00_00_00_00_00_00n, //knights
  0x24_00_00_00_00_00_00_00n, //bishops
  0x81_00_00_00_00_00_00_00n, //rooks
  0x08_00_00_00_00_00_00_00n, //queen
  0x10_00_00_00_00_00_00_00n, //king
] as const;

const PIECE_SYMBOLS: Record<number, string> = {
  0: "P",
  1: "N",
  2: "B",
  3: "R",
  4: "Q",
  5: "K",
};

const pieces = ["pawn", "knight", "bishop", "rook", "queen", "king"] as const;
type Pieces = (typeof pieces)[number];

interface GameStore {
  gameState: readonly bigint[];
  getValidMoves: (
    name: Pieces,
    tile: number,
    color: "white" | "black",
  ) => bigint;
  getFriendlyFire: (color: "white" | "black") => bigint;
  getPieceAtIdx: (
    idx: number,
  ) => { symbol: string; color: "white" | "black" } | null;
}

const useGameStore = create<GameStore>((set, get) => ({
  gameState: DEFAULT_GAME_STATE,
  getValidMoves: (name, tile, color) => {
    switch (name) {
      case "pawn": {
      }
      case "knight": {
        const friendly = get().getFriendlyFire(color);
        return KNIGHT_LUT[tile] & BigInt.asUintN(64, ~friendly);
      }
      case "bishop": {
      }
      case "rook": {
      }
      case "queen": {
      }
      case "king": {
      }
      default: {
        return 0n;
      }
    }
  },
  getFriendlyFire: (c) => {
    const state = get().gameState;
    let friendly: bigint = 0n;

    if (c === "white") {
      for (let i = 0; i < 6; i++) {
        friendly |= state[i];
      }
    } else {
      for (let i = 6; i < 12; i++) {
        friendly |= state[i];
      }
    }

    return friendly;
  },
  getPieceAtIdx: (idx) => {
    const state = get().gameState;
    const bIdx = BigInt(idx);

    for (let i = 0; i < state.length; i++) {
      if ((state[i] >> bIdx) & 1n) {
        return {
          symbol: PIECE_SYMBOLS[i % 6],
          color: i > 5 ? "black" : "white",
        };
      }
    }

    return null;
  },
}));

export { useGameStore };
