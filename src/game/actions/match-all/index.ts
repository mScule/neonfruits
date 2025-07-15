import type { ActionImplementation, Action } from "@/engine";
import type { GameContext } from "@/game";

import match from "./functions/match";

// Key

export const MATCH_ALL_ACTION = "MATCH_ALL";

// Definition

export type MatchAllAction = Action<typeof MATCH_ALL_ACTION>;

// Implementation

export const matchAllAction: ActionImplementation<GameContext, MatchAllAction> = (
  context
) => {
  for (const [row, columns] of context.board.entries()) {
    for (const [column] of columns.entries()) {
      match(context, { row, column })
    }
  }
};
