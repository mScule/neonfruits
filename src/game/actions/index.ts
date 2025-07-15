import { createActionResolver } from "@/engine";

import type { GameContext } from "..";

import { ADD_ACTION, addAction } from "./add";
import { FLIP_ACTION, flipAction } from "./flip";
import { DROP_ALL_ACTION, dropAllAction } from "./drop-all";
import { MATCH_ALL_ACTION, matchAllAction } from "./match-all";
import { COMPOSITE_ACTION, compositeAction } from "./composite";

export const resolveAction = createActionResolver<GameContext>({
  [ADD_ACTION]: addAction,
  [FLIP_ACTION]: flipAction,
  [DROP_ALL_ACTION]: dropAllAction,
  [MATCH_ALL_ACTION]: matchAllAction,
  [COMPOSITE_ACTION]: compositeAction,
});
