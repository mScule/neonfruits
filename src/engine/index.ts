/** "Game engine" for React UI-based games where core mechanic is centered around manipulating grid in some way */

export type ActionImplementation<C = unknown, T extends Action = Action> = (
  context: C,
  action: T
) => void;
export type Action<T = unknown> = { type: T };
export type PayloadAction<T = unknown, P = unknown> = Action<T> & {
  payload: P;
};
export type Location = { row: number; column: number };
export type Content<T extends string> = "empty" | T;
export type Board<T extends string> = { id: string; value: Content<T> }[][];
export type ActionResolver<C> = (context: C, action: Action) => void;

export function createActionResolver<C>(
  register: Record<string, ActionImplementation<C, any>>
): ActionResolver<C> {
  return (context: C, action: Action) =>
    register[action.type as string](context, action);
}

export function isLocationEqual(a: Location, b: Location): boolean {
  return a.row === b.row && a.column === b.column;
}

export function areLocationsInContact(a: Location, b: Location): boolean {
  const isAbove = () => a.column === b.column && a.row === b.row - 1;
  const isBelow = () => a.column === b.column && a.row === b.row + 1;
  const isBefore = () => a.row === b.row && a.column === b.column - 1;
  const isAfter = () => a.row === b.row && a.column === b.column + 1;

  return isAbove() || isBelow() || isBefore() || isAfter();
}

export function getActionPayload<A extends PayloadAction>(
  action: Action | null,
  type: A["type"]
): null | A["payload"] {
  if (!action) {
    return null;
  }

  if (action.type !== type) {
    return null;
  }

  return (action as A).payload;
}
