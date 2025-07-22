import { MIN_MATCH_COUNT, type GameContext } from "@/game";
import { get } from "@/engine/board";

import matchSurroundingHorizontal from "./match-surrounding-horizontal";
import matchSurroundingVertical from "./match-surrounding-vertical";

import type { Location } from "@/engine";
import type { ClearAction } from "../../clear";
import type { CountScoreAction } from "../../count-score";

export default function match(context: GameContext, at: Location) {
  const base = get(context.board, at);

  if (!base) {
    return;
  }

  if (base === "empty") {
    return;
  }

  const matches = [at];

  const surroundingHorizontalMatches = matchSurroundingHorizontal(
    context.board,
    at
  );

  if (surroundingHorizontalMatches.length >= MIN_MATCH_COUNT - 1) {
    matches.push(...surroundingHorizontalMatches);
  }

  const surroundingVerticalMatches = matchSurroundingVertical(
    context.board,
    at
  );

  if (surroundingVerticalMatches.length >= MIN_MATCH_COUNT - 1) {
    matches.push(...surroundingVerticalMatches);
  }

  const matchCount = matches.length;

  if (matchCount < MIN_MATCH_COUNT) {
    return;
  }

  const countScore: CountScoreAction = {
    type: "COUNT_SCORE",
    payload: matches,
  };

  const clear: ClearAction = {
    type: "CLEAR",
    payload: matches,
  };

  context.actions.push(clear, countScore);

  return true;
}
