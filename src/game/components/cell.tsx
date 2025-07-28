import clsx from "clsx";
import {
  areLocationsInContact,
  getActionPayload,
  isLocationEqual,
  type Action,
  type Location,
} from "@/engine";

import { get } from "@/engine/board";

import useGame from "@/game/use-game";
import type { FlipAction } from "@/game/actions/flip";
import type { CountScoreAction } from "@/game/actions/count-score";

import CellContent from "./cell-content";
import { type DropAction } from "../actions/drop";

type Props = {
  location: Location;
};

function isFlipFrom(action: Action | null, location: Location): boolean {
  const flipAction = getActionPayload<FlipAction>(
    action,
    "FLIP"
  );

  if (!flipAction) {
    return false;
  }

  const { from } = flipAction;

  return from.row === location.row && from.column === location.column;
}

function isFlipTo(action: Action | null, location: Location): boolean {
  const flipAction = getActionPayload<FlipAction>(
    action,
    "FLIP"
  );

  if (!flipAction) {
    return false;
  }

  const { to } = flipAction;

  return to.row === location.row && to.column === location.column;
}

function getFlipFormAnimation(action: FlipAction): string {
  const { payload } = action;
  const { from, to } = payload;

  const isRowStill = from.row === to.row;
  const isColStill = from.column === to.column;

  const isAbove = from.row < to.row;
  const isBefore = from.column < to.column;

  return clsx(
    !isRowStill && (isAbove ? "translate-y-11" : "-translate-y-11"),
    !isColStill && (isBefore ? "translate-x-11" : "-translate-x-11")
  );
}

function getFlipToAnimation(action: FlipAction): string {
  const { payload } = action;
  const { from, to } = payload;

  const isRowStill = from.row === to.row;
  const isColStill = from.column === to.column;

  const isBelow = from.row > to.row;
  const isAfter = from.column > to.column;

  return clsx(
    !isRowStill && (isBelow ? "translate-y-11" : "-translate-y-11"),
    !isColStill && (isAfter ? "translate-x-11" : "-translate-x-11")
  );
}

export default function Cell({ location }: Props) {
  const { state, select, queueAction } = useGame();
  const { selection } = state;

  const type = get(state.board, location);

  const isSelected = selection && isLocationEqual(selection, location);
  const isNextToSelected =
    selection && !isSelected && areLocationsInContact(selection, location);

  const isMatched = getActionPayload<CountScoreAction>(
    state.currentAction,
    "COUNT_SCORE"
  )?.find((l) => isLocationEqual(l, location));

  // TODO: Fix off by one error
  const isFalling = getActionPayload<DropAction>(
    state.currentAction,
    "DROP"
  )?.find((l) =>
    isLocationEqual(l, { row: location.row - 1, column: location.column })
  );

  const isEmpty = !type || type === "empty";

  function flip(from: Location, to: Location) {
    const action: FlipAction = {
      type: "FLIP",
      payload: {
        from,
        to,
      },
    };

    queueAction(action);
    select(null);
  }

  function handleEmpty() {
    if (!selection) {
      return;
    }

    if (selection && !isSelected && !isNextToSelected) {
      return;
    }

    if (!selection) {
      select(location);
      return;
    }

    flip(selection, location);
  }

  function handleContentful() {
    if (selection && !isSelected && !isNextToSelected) {
      return;
    }

    if (!selection) {
      select(location);
      return;
    }

    if (isLocationEqual(selection, location)) {
      select(null);
      return;
    }

    flip(selection, location);
  }

  if (isEmpty) {
    return (
      <div
        className={clsx(
          "w-10 h-10 flex flex-row justify-center items-center",
          isNextToSelected &&
            "border-2 rounded-2xl border-violet-300 drop-shadow-md drop-shadow-violet-500 cursor-pointer"
        )}
        onClick={handleEmpty}
      >
        {isNextToSelected && (
          <div className="w-3 h-3 border-2 border-inherit rounded-4xl" />
        )}
      </div>
    );
  }

  return (
    <div
      key={JSON.stringify(location)}
      className={clsx(
        "w-10 h-10 transition-all",
        isFalling && "-translate-y-11",
        isMatched && "opacity-0",
        isFlipFrom(state.currentAction, location) &&
          getFlipFormAnimation(state.currentAction as FlipAction),
        isFlipTo(state.currentAction, location) &&
          getFlipToAnimation(state.currentAction as FlipAction)
      )}
      onClick={handleContentful}
    >
      <CellContent
        type={type}
        variant={
          !selection || isSelected || isNextToSelected
            ? "highlighted"
            : "default"
        }
      />
    </div>
  );
}
