import { create } from "zustand";
import { KNIGHT_LUT, CROSS_LUT } from "@/lib/lut";
import { INITIAL_GAME_STATE } from "@/lib/constants";
import { reverse64 } from "@/lib/utils";
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

/**
 * Calculates sliding attacks using Hyperbola Quintessence.
 * https://www.chessprogramming.org/Hyperbola_Quintessence
 * @param tile The index of the piece (0-63)
 * @param occupied A bitboard of all pieces currently on the board
 */
function getCrossAttacks(tile: number, occupied: bigint): bigint {
  const s = BigInt(tile);
  const slider = 1n << s;

  // 1. Generate Masks
  const fileMask = 0x0101010101010101n << s % 8n;
  const rankMask = 0xffn << (8n * (s / 8n));

  // --- VERTICAL ATTACKS (File) ---
  const fileBlockers = occupied & fileMask;
  // Forward (up the file)
  const fwdFile = (fileBlockers - 2n * slider) ^ fileBlockers;
  // Backward (down the file)
  const revFileBlockers = reverse64(fileBlockers);
  const revSlider = reverse64(slider);
  const backFile = (revFileBlockers - 2n * revSlider) ^ revFileBlockers;
  const fileAttacks = (fwdFile | reverse64(backFile)) & fileMask;

  // --- HORIZONTAL ATTACKS (Rank) ---
  const rankBlockers = occupied & rankMask;
  // Forward (right across the rank)
  const fwdRank = (rankBlockers - 2n * slider) ^ rankBlockers;
  // Backward (left across the rank)
  const revRankBlockers = reverse64(rankBlockers);
  // (revSlider is already calculated)
  const backRank = (revRankBlockers - 2n * revSlider) ^ revRankBlockers;
  const rankAttacks = (fwdRank | reverse64(backRank)) & rankMask;

  // Combine and remove the square the slider is standing on
  return (fileAttacks | rankAttacks) & ~slider;
}

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
    if (!p) return 0n;
    const friendly = get().getFriendlyFire(p.color);
    const occupied =
      get().getFriendlyFire(p.color === "white" ? "black" : "white") | friendly;
    switch (p?.name) {
      case "P": {
        return 0n;
      }
      case "N": {
        return KNIGHT_LUT[tile] & ~friendly;
      }
      case "B": {
        return 0n;
      }
      case "R": {
        const attacks = getCrossAttacks(tile, occupied);
        return attacks & ~friendly;
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
  getTotalOccupancy: () =>
    get().getFriendlyFire("white") | get().getFriendlyFire("black"),
}));

export { useGameStore, type Piece };
