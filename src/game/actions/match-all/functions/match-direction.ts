import type { Location } from "@/engine";
import { get } from "@/engine/board";
import type { GameBoard } from "@/game";

import FOREVER from "@/utility/forever";

export default function matchDirection(
  board: GameBoard,
  at: Location,
  direction: Location
): Location[] {
  const content = get(board, at);

  if (!content) {
    return [];
  }

  const matches: Location[] = [];

  let location: Location = structuredClone(at);

  while (FOREVER) {
    location.row += direction.row;
    location.column += direction.column;

    const result = get(board, location);

    if (result === content) {
      matches.push(structuredClone(location));
      continue;
    }

    break;
  }

  return matches;
}
