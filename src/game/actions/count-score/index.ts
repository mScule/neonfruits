import type { ActionImplementation, Location, PayloadAction } from "@/engine";
import type { GameContext } from "@/game";
import resolveScore from "../match-all/functions/resolve-score";
import { get } from "@/engine/board";

export const COUNT_SCORE_ACTION = "COUNT_SCORE";

// Definition

export type CountScoreAction = PayloadAction<
  typeof COUNT_SCORE_ACTION,
  Location[]
>;

// Implementation

export const countScoreAction: ActionImplementation<
  GameContext,
  CountScoreAction
> = (context, action) => {
  const { payload } = action;

  const score = payload
    .map((location) => resolveScore(get(context.board, location) ?? "empty"))
    .reduce((a, b) => a + b);
  
  context.score += score
};
