import type { Location } from "@/engine";
import { get } from "@/engine/board";

import matchAbove from "./match-above";
import matchBelow from "./match-below";
import type { GameBoard } from "@/game";

export default function matchSurroundingVertical(
  board: GameBoard,
  at: Location
): Location[] {
  const content = get(board, at);

  if (!content) {
    return [];
  }

  return [...matchAbove(board, at), ...matchBelow(board, at)];
}
