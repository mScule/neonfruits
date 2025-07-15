import type {
  ActionImplementation,
  PayloadAction,
  Content,
  Location,
} from "@/engine";

import { set } from "@/engine/board";
import type { GameContent, GameContext } from "@/game";

// Key

export const ADD_ACTION = "ADD";

// Definition

export type AddAction = PayloadAction<
  typeof ADD_ACTION,
  { content: Content<GameContent>; location: Location }
>;

// Implementation

export const addAction: ActionImplementation<GameContext, AddAction> = (
  context,
  action
) => {
  const { payload } = action;
  const { location, content } = payload;

  set(context.board, location, content);
};
