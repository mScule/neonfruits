import type { ActionImplementation, PayloadAction, Location } from "@/engine";
import { flip } from "@/engine/board";
import type { GameContext } from "@/game";

// Key

export const FLIP_ACTION = "FLIP";

// Definition

export type FlipAction = PayloadAction<
  typeof FLIP_ACTION,
  { from: Location; to: Location }
>;

// Implementation

export const flipAction: ActionImplementation<GameContext, FlipAction> = (
  context: GameContext,
  action: FlipAction
) => {
  const { payload } = action;
  const { from, to } = payload;

  flip(context.board, from, to);

  context.moves++;
};
