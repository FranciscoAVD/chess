import { create } from "zustand";
import { KNIGHT_LUT, CROSS_LUT } from "@/lib/lut";
import { INITIAL_GAME_STATE } from "@/lib/constants";

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
  getTotalOccupancy: () => bigint;
}

const useGameStore = create<GameStore>((set, get) => ({
  gameState: INITIAL_GAME_STATE,
  activePiece: null,
  setActivePiece: (t) =>
    set((state) => ({
      activePiece: t,
      validMoves: t !== null ? state.getValidMoves(t) : 0n,
    })),
  validMoves: 0n,
  getValidMoves: (tile) => {
    const p = get().getPieceAtTile(tile);

    switch (p?.name) {
      case "P": {
        console.log("Clicked on pawn");
        return 0n;
      }
      case "N": {
        console.log("Clicked on knight");
        const friendly = get().getFriendlyFire(p.color);
        return KNIGHT_LUT[tile] & ~friendly;
      }
      case "B": {
        console.log("Clicked on bishop");
        return 0n;
      }
      case "R": {
        console.log("Clicked on rook");
        return CROSS_LUT[tile];
      }
      case "Q": {
        return 0n;
      }
      case "K": {
        return 0n;
      }
      default: {
        console.log("No piece found at tile: ", tile);
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
  getTotalOccupancy: () =>
    get().getFriendlyFire("white") | get().getFriendlyFire("black"),
}));

export { useGameStore, type Piece };
