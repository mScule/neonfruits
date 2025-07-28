import { createActionResolver } from "@/engine";

import type { GameContext } from "..";

import { ADD_ACTION, addAction } from "./add";
import { FLIP_ACTION, flipAction } from "./flip";
import { DROP_ALL_ACTION, dropAllAction } from "./drop-all";
import { MATCH_ALL_ACTION, matchAllAction } from "./match-all";
import { COMPOSITE_ACTION, compositeAction } from "./composite";
import { CLEAR_ACTION, clearAction } from "./clear";
import { COUNT_SCORE_ACTION, countScoreAction } from "./count-score";
import { DROP_ACTION, dropAction } from "./drop";

import { FLIP_ANIMATION_ACTION, flipAnimationAction } from "./flip-animation";

export const resolveAction = createActionResolver<GameContext>({
  [ADD_ACTION]: addAction,
  [FLIP_ACTION]: flipAction,
  [FLIP_ANIMATION_ACTION]: flipAnimationAction,
  [DROP_ALL_ACTION]: dropAllAction,
  [DROP_ACTION]: dropAction,
  [MATCH_ALL_ACTION]: matchAllAction,
  [COMPOSITE_ACTION]: compositeAction,
  [CLEAR_ACTION]: clearAction,
  [COUNT_SCORE_ACTION]: countScoreAction,
});
