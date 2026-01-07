import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Reverses the bits of a 64-bit BigInt.
 * In a performance-critical engine, you would use a precomputed
 * lookup table for bytes to make this even faster.
 */
function reverse64(n: bigint): bigint {
  let x = n;
  x = ((x >> 1n) & 0x5555555555555555n) | ((x & 0x5555555555555555n) << 1n);
  x = ((x >> 2n) & 0x3333333333333333n) | ((x & 0x3333333333333333n) << 2n);
  x = ((x >> 4n) & 0x0f0f0f0f0f0f0f0fn) | ((x & 0x0f0f0f0f0f0f0f0fn) << 4n);
  x = ((x >> 8n) & 0x00ff00ff00ff00ffn) | ((x & 0x00ff00ff00ff00ffn) << 8n);
  x = ((x >> 16n) & 0x0000ffff0000ffffn) | ((x & 0x0000ffff0000ffffn) << 16n);
  x = (x >> 32n) | (x << 32n);
  return x & 0xffffffffffffffffn; // Ensure we stay at 64 bits
}

export { cn, reverse64 };
