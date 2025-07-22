import type { GameBoard, GameContent } from "@/game";
import { describe, it, expect } from "vitest";
import { createBoard, get, set } from "./board";
import {
  isEqualToSchema,
  populateBoard,
  type GameBoardSchema,
} from "@/game/level-reader";
import type { AddAction } from "@/game/actions/add";
import type { Location } from ".";
import { resolveAction } from "@/game/actions";
import type { FlipAction } from "@/game/actions/flip";
import type { DropAllAction } from "@/game/actions/drop";

function mockLevel1(): GameBoard {
  const board = createBoard<GameContent>(5, 2);

  const schema: GameBoardSchema = [
    ["a", "o"],
    ["o", "a"],
    ["o", "a"],
    [".", "."],
    [".", "."],
  ];

  populateBoard(board, schema);

  return board;
}

function mockLevel2(): GameBoard {
  const board = createBoard<GameContent>(5, 3);

  const schema: GameBoardSchema = [
    ["a", "o", "a"],
    ["a", ".", "."],
    [".", ".", "a"],
    [".", "o", "."],
    ["a", "o", "o"],
  ];

  populateBoard(board, schema);

  return board;
}

describe("board", () => {
  it("can create board that's 16 x 16", () => {
    const board = createBoard(16, 16);

    expect(board.length).toBe(16);
    expect(board[0].length).toBe(16);
  });

  it("will initially be empty", () => {
    const board = createBoard(16, 16);

    for (const row of board) {
      for (const column of row) {
        expect(column.value).toBe("empty");
      }
    }
  });
});

describe("safe get", () => {
  it("will return null if location doesnt exist", () => {
    const board = createBoard(16, 16);

    expect(get(board, { row: -1, column: -1 })).toBe(null);
    expect(get(board, { row: 0, column: 0 })).toBe("empty");
    expect(get(board, { row: 15, column: 15 })).toBe("empty");
    expect(get(board, { row: 16, column: 16 })).toBe(null);
  });
});

describe("safe set", () => {
  it("won't cause side effects if content is being set outside of the board", () => {
    const board = createBoard<GameContent>(16, 16);

    set(board, { row: -1, column: -1 }, "apple");
    set(board, { row: 16, column: 16 }, "apple");
    set(board, { row: 4, column: 4 }, "orange");

    board.forEach((row, rowIndex) =>
      row.forEach((column, columnIndex) =>
        rowIndex === 4 && columnIndex === 4
          ? expect(column.value).toBe("orange")
          : expect(column.value).toBe("empty")
      )
    );
  });
});

describe("add action", () => {
  it("adds content into empty cell", () => {
    const board = createBoard<GameContent>(16, 16);

    const location: Location = { row: 3, column: 3 };

    const action: AddAction = {
      type: "ADD",
      payload: { location, content: "apple" },
    };

    resolveAction({ score: 0, moves: 0, board }, action);

    const cell = get(board, location);

    expect(cell).toBe("apple");
  });
  it("adds content on top of existing content", () => {
    const board = createBoard<GameContent>(16, 16);

    const location: Location = { row: 3, column: 3 };

    const actions: AddAction[] = [
      {
        type: "ADD",
        payload: { location, content: "apple" },
      },
      {
        type: "ADD",
        payload: { location, content: "orange" },
      },
    ];

    for (const action of actions) {
      resolveAction({ score: 0, moves: 0, board }, action);

      const cell = get(board, action.payload.location);

      expect(cell).toBe(action.payload.content);
    }
  });
});
describe("flip action", () => {
  it("flips content of two cells", () => {
    const level = mockLevel1();

    // Check original position
    const topLeftLocation: Location = { row: 0, column: 0 };
    const topRightLocation: Location = { row: 0, column: 1 };

    let topLeft = get(level, topLeftLocation);
    let topRight = get(level, topRightLocation);

    expect(topLeft).toBe("apple");
    expect(topRight).toBe("orange");

    // Do the flip
    const action: FlipAction = {
      type: "FLIP",
      payload: { from: topLeftLocation, to: topRightLocation },
    };

    resolveAction({ score: 0, moves: 0, board: level }, action);

    // Check flipped position
    topLeft = get(level, topLeftLocation);
    topRight = get(level, topRightLocation);

    expect(topLeft).toBe("orange");
    expect(topRight).toBe("apple");
  });
});
describe("drop action", () => {
  it("drops items if there are empty spaces below", () => {
    const level = mockLevel2();

    const action: DropAllAction = { type: "DROP_ALL" };

    expect(
      isEqualToSchema(level, [
        ["a", "o", "a"],
        ["a", ".", "."],
        [".", ".", "a"],
        [".", "o", "."],
        ["a", "o", "o"],
      ])
    ).toBe(true);

    resolveAction({ score: 0, moves: 0, board: level }, action);

    expect(
      isEqualToSchema(level, [
        [".", ".", "."],
        ["a", "o", "a"],
        ["a", ".", "."],
        [".", "o", "a"],
        ["a", "o", "o"],
      ])
    ).toBe(true);

    resolveAction({ score: 0, moves: 0, board: level }, action);

    expect(
      isEqualToSchema(level, [
        [".", ".", "."],
        [".", ".", "."],
        ["a", "o", "a"],
        ["a", "o", "a"],
        ["a", "o", "o"],
      ])
    ).toBe(true);

    resolveAction({ score: 0, moves: 0, board: level }, action);

    expect(
      isEqualToSchema(level, [
        [".", ".", "."],
        [".", ".", "."],
        ["a", "o", "a"],
        ["a", "o", "a"],
        ["a", "o", "o"],
      ])
    ).toBe(true);
  });
});
