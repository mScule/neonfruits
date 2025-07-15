import type { ActionImplementation, Action, PayloadAction } from "@/engine";
import type { GameContext } from "@/game";
import { resolveAction } from "..";

// Key
export const COMPOSITE_ACTION = "COMPOSITE";

// Interface
export type CompositeAction = PayloadAction<
  typeof COMPOSITE_ACTION,
  { actions: Action[] }
>;

// Implementation
export const compositeAction: ActionImplementation<
  GameContext,
  CompositeAction
> = (context, action) => {
  const { payload } = action;
  const { actions } = payload;

  for (const action of actions) {
    resolveAction(context, action);
  }
};
