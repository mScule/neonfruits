import type { Action, ActionImplementation, Location } from "@/engine";
import { flip, get } from "@/engine/board";
import type { GameContext } from "@/game";

import range from "@/utility/range";
import type { DropAction } from "../drop";

// Key

export const DROP_ALL_ACTION = "DROP_ALL";

// Definition

export type DropAllAction = Action<typeof DROP_ALL_ACTION>;

// Implementation

export const dropAllAction: ActionImplementation<GameContext, DropAllAction> = (
  context
) => {
  const reversed = range(context.board.length).reverse();

  const falling: Location[] = [];

  const boardCopy = structuredClone(context.board);

  for (const rowIndex of reversed) {
    const row = boardCopy[rowIndex];

    for (const columnIndex of row.keys()) {
      const aboveLocation = { row: rowIndex, column: columnIndex };
      const belowLocation = { row: rowIndex + 1, column: columnIndex };

      const above = get(boardCopy, aboveLocation);
      const below = get(boardCopy, belowLocation);

      if (!above || !below) {
        continue;
      }

      if (above === "empty") {
        continue;
      }

      if (below !== "empty") {
        continue;
      }

      falling.push(aboveLocation);

      flip(boardCopy, aboveLocation, belowLocation);
    }
  }

  if (!falling.length) {
    return;
  }

  const drop: DropAction = {
    type: "DROP",
    payload: falling,
  };

  context.actions.push(drop);
};
