import type { Action, ActionImplementation } from "@/engine";
import { get, set } from "@/engine/board";
import type { GameContext } from "@/game";

import range from "@/utility/range";

// Key

export const DROP_ALL_ACTION = "DROP_ALL";

// Definition

export type DropAllAction = Action<typeof DROP_ALL_ACTION>;

// Implementation

export const dropAllAction: ActionImplementation<GameContext, DropAllAction> = (context) => {
  const reversed = range(context.board.length).reverse();

  for (const rowIndex of reversed) {
    const row = context.board[rowIndex];

    for (const columnIndex of row.keys()) {
      const aboveLocation = { row: rowIndex, column: columnIndex };
      const belowLocation = { row: rowIndex + 1, column: columnIndex };

      const above = get(context.board, aboveLocation);
      const below = get(context.board, belowLocation);

      if (!above || !below) {
        continue;
      }

      if (below !== "empty") {
        continue;
      }

      set(context.board, belowLocation, above);
      set(context.board, aboveLocation, below);
    }
  }
};
