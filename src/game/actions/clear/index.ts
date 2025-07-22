// Key

import type { ActionImplementation, Location, PayloadAction } from "@/engine";
import { clear } from "@/engine/board";
import type { GameContext } from "@/game";

export const CLEAR_ACTION = "CLEAR";

// Definition

export type ClearAction = PayloadAction<typeof CLEAR_ACTION, Location[]>;

// Implementation

export const clearAction: ActionImplementation<GameContext, ClearAction> = (
  context: GameContext,
  action: ClearAction
) => {
  const { payload } = action;

  clear(context.board, payload);
};
