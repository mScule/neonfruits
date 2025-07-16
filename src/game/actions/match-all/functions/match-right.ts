import type { Location } from "@/engine";

import matchDirection from "./match-direction";
import type { GameBoard } from "@/game";

export default function matchRight(board: GameBoard, at: Location): Location[] {
  const direction: Location = { row: 0, column: 1 };
  return matchDirection(board, at, direction);
}
