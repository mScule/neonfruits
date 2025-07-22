import type { ActionImplementation, Location, PayloadAction } from "@/engine";
import { flip } from "@/engine/board";
import type { GameContext } from "@/game";

// Key

export const DROP_ACTION = "DROP";

// Definition

export type DropAction = PayloadAction<typeof DROP_ACTION, Location[]>;

// Implementation

export const dropAction: ActionImplementation<GameContext, DropAction> = (
  context,
  action
) => {
  const { payload } = action;

  for (const location of payload) {
    flip(context.board, location, {
      row: location.row + 1,
      column: location.column,
    });
  }
};
