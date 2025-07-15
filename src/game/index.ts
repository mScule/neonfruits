import type { Board } from "@/engine";

export const MIN_MATCH_COUNT = 3;

export const TICK_RATE_MS = 50;

export const APPLE_SCORE = 100;
export const ORANGE_SCORE = 150;
export const BANANA_SCORE = 200;
export const CHERRY_SCORE = 300;

export type GameContent = "apple" | "orange" | "banana" | "cherry";

export type GameContext = {
  moves: number;
  score: number;
  board: Board<GameContent>;
};

export type GameBoard = Board<GameContent>;
