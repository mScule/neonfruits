import { MIN_MATCH_COUNT, type GameContext } from "@/game";
import { get, clear } from "@/engine/board";

import matchSurroundingHorizontal from "./match-surrounding-horizontal";
import matchSurroundingVertical from "./match-surrounding-vertical";
import resolveScore from "./resolve-score";
import type { Location } from "@/engine";

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

  context.score += resolveScore(base) * matchCount;

  clear(context.board, matches);

  return true;
}
