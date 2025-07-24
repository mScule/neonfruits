import { MIN_MATCH_COUNT, type GameBoard, type GameContext } from "@/game";
import { get } from "@/engine/board";

import matchSurroundingHorizontal from "./match-surrounding-horizontal";
import matchSurroundingVertical from "./match-surrounding-vertical";

import type { Location } from "@/engine";
import type { ClearAction } from "../../clear";
import type { CountScoreAction } from "../../count-score";

export default function match(context: GameContext, matchBoard: GameBoard, at: Location) {
  const base = get(matchBoard, at);

  if (!base) {
    return;
  }

  if (base === "empty") {
    return;
  }

  const matches = [at];

  const surroundingHorizontalMatches = matchSurroundingHorizontal(
    matchBoard,
    at
  );

  if (surroundingHorizontalMatches.length >= MIN_MATCH_COUNT - 1) {
    matches.push(...surroundingHorizontalMatches);
  }

  const surroundingVerticalMatches = matchSurroundingVertical(
    matchBoard,
    at
  );

  if (surroundingVerticalMatches.length >= MIN_MATCH_COUNT - 1) {
    matches.push(...surroundingVerticalMatches);
  }

  const matchCount = matches.length;

  if (matchCount < MIN_MATCH_COUNT) {
    return;
  }

  for (const match of matches) {
    matchBoard[match.row][match.column] = { id: match.row + match.column + "", value: "empty" }
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
