import type { Location } from "@/engine";
import { get } from "@/engine/board";

import matchLeft from "./match-left";
import matchRight from "./match-right";
import type { GameBoard } from "@/game";

export default function matchSurroundingHorizontal(
  board: GameBoard,
  at: Location
): Location[] {
  const content = get(board, at);

  if (!content) {
    return [];
  }

  return [...matchLeft(board, at), ...matchRight(board, at)];
}
