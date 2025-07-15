import type { Content } from "@/engine";
import { get, set } from "@/engine/board";
import type { GameBoard, GameContent } from ".";

export type GameContentSchema = "." | "a" | "o" | "b" | "c";
export type GameBoardSchema = GameContentSchema[][];

export function resolveContentSchema(schema: GameContentSchema): Content<GameContent> {
  switch (schema) {
    case ".":
      return "empty";
    case "a":
      return "apple";
    case "o":
      return "orange";
    case "b":
      return "banana";
    case "c":
      return "cherry";
  }
}

export function populateRow(
  board: GameBoard,
  row: number,
  columns: GameContentSchema[]
) {
  for (const [column, schema] of columns.entries()) {
    set(board, { row, column }, resolveContentSchema(schema));
  }
}

export function populateBoard(board: GameBoard, schema: GameBoardSchema) {
  for (const [row, columns] of schema.entries()) {
    populateRow(board, row, columns);
  }
}

export function isEqualToSchema(board: GameBoard, schema: GameBoardSchema) {
  for (const [rowIndex, row] of schema.entries()) {
    for (const [columnIndex, column] of row.entries()) {
      if (
        resolveContentSchema(column) !==
        get(board, { row: rowIndex, column: columnIndex })
      ) {
        return false;
      }
    }
  }
  return true;
}
