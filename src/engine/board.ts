import createErrorMessage from "@/utility/create-error-message";
import range from "@/utility/range";

import type { Board, Content, Location } from ".";
import isIndexInRangeOf from "@/utility/is-index-in-range-of";

export function createBoard<T extends string>(
  height: number,
  width: number
): Board<T> {
  return range(height).map((_, row) =>
    range(width).map((_, column) => ({ id: `${row}${column}`, value: "empty" }))
  );
}

export function get<T extends string>(
  board: Board<T>,
  location: Location
): Content<T> | null {
  const { row, column } = location;

  if (!isIndexInRangeOf(board, row)) {
    return null;
  }

  const columns = board[row];

  if (!isIndexInRangeOf(columns, column)) {
    return null;
  }

  return columns[column].value;
}

export function set<T extends string>(
  board: Board<T>,
  location: Location,
  value: Content<T>
) {
  try {
    const { row, column } = location;
    board[row][column].value = value;
  } catch (error) {
    console.warn(createErrorMessage(`Cannot set ${JSON.stringify(location)}`));
  }
}

export function flip<T extends string>(
  board: Board<T>,
  from: Location,
  to: Location
) {
  try {
    const originalFrom = structuredClone(board[from.row][from.column]);
    const originalTo = structuredClone(board[to.row][to.column]);

    board[to.row][to.column] = originalFrom;
    board[from.row][from.column] = originalTo;
  } catch (error) {
    console.warn(createErrorMessage(`Cannot set ${JSON.stringify(location)}`));
  }
}

export function clear<T extends string>(
  board: Board<T>,
  locations: Location[]
) {
  for (const location of locations) {
    set(board, location, "empty");
  }
}
