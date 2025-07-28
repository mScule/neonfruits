import type { Action, Board } from "@/engine";

export const DEBUG_MODE = false;

export const MIN_MATCH_COUNT = 3;

export const TICK_RATE_MS = 250;

export const APPLE_SCORE = 100;
export const ORANGE_SCORE = 150;
export const BANANA_SCORE = 200;
export const CHERRY_SCORE = 300;

export type GameContent = "apple" | "orange" | "banana" | "cherry";

export type GameContext = {
  moves: number;
  score: number;
  board: Board<GameContent>;
  actions: Action[];
};

export type GameBoard = Board<GameContent>;
