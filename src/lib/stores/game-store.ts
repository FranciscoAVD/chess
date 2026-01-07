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

const pieces = ["P", "N", "B", "R", "Q", "K"] as const;
type PieceNames = (typeof pieces)[number];

const PIECE_SYMBOLS: Record<number, PieceNames> = {
  0: "P",
  1: "N",
  2: "B",
  3: "R",
  4: "Q",
  5: "K",
};

interface Piece {
  name: PieceNames;
  color: "white" | "black";
  tile: number;
}
interface GameStore {
  gameState: readonly bigint[];
  activePiece: number | null;
  validMoves: bigint;
  setActivePiece: (tile: number | null) => void;
  getValidMoves: (tile: number) => bigint;
  getFriendlyFire: (color: "white" | "black") => bigint;
  getPieceAtTile: (tile: number) => Omit<Piece, "tile"> | null;
}

const useGameStore = create<GameStore>((set, get) => ({
  gameState: DEFAULT_GAME_STATE,
  activePiece: null,
  setActivePiece: (t) =>
    set((state) => ({
      activePiece: t,
      validMoves: t ? state.getValidMoves(t) : 0n,
    })),
  validMoves: 0n,
  getValidMoves: (tile) => {
    const p = get().getPieceAtTile(tile);
    if (!p) return 0n;
    switch (p.name) {
      case "P": {
        return 0n;
      }
      case "N": {
        const friendly = get().getFriendlyFire(p.color);
        return KNIGHT_LUT[tile] & BigInt.asUintN(64, ~friendly);
      }
      case "B": {
        return 0n;
      }
      case "R": {
        return 0n;
      }
      case "Q": {
        return 0n;
      }
      case "K": {
        return 0n;
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
  getPieceAtTile: (tile) => {
    const state = get().gameState;
    const bIdx = BigInt(tile);

    for (let i = 0; i < state.length; i++) {
      if ((state[i] >> bIdx) & 1n) {
        return {
          name: PIECE_SYMBOLS[i % 6],
          color: i > 5 ? "black" : "white",
        };
      }
    }

    return null;
  },
}));

export { useGameStore, type Piece };
