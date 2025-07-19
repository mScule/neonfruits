import {
  areLocationsInContact,
  isLocationEqual,
  type Action,
  type Location,
} from "@/engine";
import useGame from "../use-game";
import { get } from "@/engine/board";
import clsx from "clsx";
import type { FlipAction } from "../actions/flip";
import CellContent from "./cell-content";

type Props = {
  location: Location;
};

function getFlipAction(action: Action | null): FlipAction | null {
  if (!action) {
    return null;
  }

  if (action.type !== "FLIP") {
    return null;
  }

  return action as FlipAction;
}

function isFlipFrom(action: Action | null, location: Location): boolean {
  const flipAction = getFlipAction(action);

  if (!flipAction) {
    return false;
  }

  const {
    payload: { from },
  } = flipAction;

  return from.row === location.row && from.column === location.column;
}

function getFlipFormAnimation(action: FlipAction): string {
  const {
    payload: { from, to },
  } = action;

  const isRowStill = from.row === to.row;
  const isColStill = from.column === to.column;

  const isAbove = from.row < to.row;
  const isBefore = from.column < to.column;

  return clsx(
    "transition ease-in-out duration-75",
    !isRowStill && (isAbove ? "translate-y-11" : "-translate-y-11"),
    !isColStill && (isBefore ? "translate-x-11" : "-translate-x-11")
  );
}

function isFlipTo(action: Action | null, location: Location): boolean {
  const flipAction = getFlipAction(action);

  if (!flipAction) {
    return false;
  }

  const {
    payload: { to },
  } = flipAction;

  return to.row === location.row && to.column === location.column;
}

function getFlipToAnimation(action: FlipAction): string {
  const {
    payload: { from, to },
  } = action;

  const isRowStill = from.row === to.row;
  const isColStill = from.column === to.column;

  const isAbove = from.row > to.row;
  const isBefore = from.column > to.column;

  return clsx(
    "transition ease-in-out duration-75",
    !isRowStill && (isAbove ? "translate-y-11" : "-translate-y-11"),
    !isColStill && (isBefore ? "translate-x-11" : "-translate-x-11")
  );
}

export default function Cell({ location }: Props) {
  const { state, select, queueAction } = useGame();
  const { selection } = state;

  const type = get(state.board, location);

  const isSelected = selection && isLocationEqual(selection, location);
  const isNextToSelected =
    selection && !isSelected && areLocationsInContact(selection, location);

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
            "border-2 rounded-2xl border-violet-300 drop-shadow-md drop-shadow-violet-500"
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
      className={clsx(
        "w-10 h-10",
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
