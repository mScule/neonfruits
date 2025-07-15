import type { Location } from "@/engine";

import matchDirection from "./match-direction";
import type { GameBoard } from "@/game";

export default function matchBelow(board: GameBoard, at: Location): Location[] {
  const direction: Location = { row: 1, column: 0 };
  return matchDirection(board, at, direction);
}
