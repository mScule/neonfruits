import { createBoard } from "@/engine/board";
import { type GameContent, type GameContext } from "@/game";
import { isEqualToSchema, populateBoard } from "@/game/level-reader";
import { expect, it, describe } from "vitest";
import { resolveAction } from "..";
import type { MatchAllAction } from ".";

function createMockContext(): GameContext {
  const context: GameContext = {
    board: createBoard<GameContent>(5, 5),
    moves: 0,
    score: 0,
  };

  populateBoard(context.board, [
    ["a", "c", "c", "o", "o"],

    ["b", "a", "b", "b", "b"],

    ["a", "b", "b", "o", "o"],

    ["c", "a", "o", "o", "c"],

    ["c", "c", "b", "o", "c"],
  ]);

  return context;
}

describe("match all -action", () => {
  it("should match and remove blocks in all directions (up, down, left, right)", () => {
    const context = createMockContext();

    expect(
      isEqualToSchema(context.board, [
        ["a", "c", "c", "o", "o"],

        ["b", "a", "b", "b", "b"],

        ["a", "b", "b", "o", "o"],

        ["c", "a", "o", "o", "c"],

        ["c", "c", "b", "o", "c"],
      ])
    ).toBe(true);

    const action: MatchAllAction = { type: "MATCH_ALL" };

    resolveAction(context, action);

    expect(
      isEqualToSchema(context.board, [
        ["a", "c", "c", "o", "o"],

        ["b", "a", ".", ".", "."],

        ["a", "b", "b", ".", "o"],

        ["c", "a", "o", ".", "c"],

        ["c", "c", "b", ".", "c"],
      ])
    ).toBe(true);
  });
});
