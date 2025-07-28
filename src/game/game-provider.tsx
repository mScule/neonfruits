import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import type { Action, Location } from "@/engine";

import { resolveAction } from "./actions";
import type { MatchAllAction } from "./actions/match-all";

import {
  TICK_RATE_MS,
  type GameContext as GameContextType,
} from ".";
import { populateBoard, type GameBoardSchema } from "./level-reader";
import { createBoard } from "@/engine/board";
import sleep from "@/utility/sleep";
import type { DropAllAction } from "./actions/drop-all";
import type { CompositeAction } from "./actions/composite";

type GameContextFeatures = {
  pause: () => void;
  reset: () => void;

  select: (location: Location | null) => void;
  queueAction: <T extends Action>(action: T) => void;

  debug: {
    next: () => void;
  };

  state: GameContextState;
};

type GameContextState = GameContextType & {
  selection: Location | null;
  currentAction: Action | null;
  paused: boolean;
};

type Props = PropsWithChildren & {
  schema: GameBoardSchema;
};

export const GameContext = createContext<GameContextFeatures | null>(null);

export default function GameProvider({ schema, children }: Props) {
  const defaultState: GameContextState = {
    moves: 0,
    score: 0,
    board: createBoard(8, 6),

    selection: null,
    currentAction: null,
    paused: false,

    actions: [],
  };

  const [state, setState] = useState<Omit<GameContextState, "selection">>(
    (() => {
      const state = structuredClone(defaultState);

      populateBoard(state.board, schema);

      return state;
    })()
  );

  const [selection, setSelection] = useState<Location | null>(null);

  function pause() {
    setState({ ...state, paused: !state.paused });
  }

  function reset() {
    const state = structuredClone(defaultState);

    populateBoard(state.board, schema);

    setState({ ...state });
  }

  function select(location: Location | null) {
    setSelection(location);
  }

  function queueAction<T extends Action>(action: T) {
    state.actions.push(action);
  }

  async function tick() {
    const latestAction = state.actions.pop();

    // Make action available for UI
    setState({ ...state, currentAction: latestAction ?? null });

    // Resolve action
    if (latestAction) {
      resolveAction(state, latestAction);
      await sleep(TICK_RATE_MS);
    } else {
      state.actions.push({
        type: "COMPOSITE",
        payload: {
          actions: [
            { type: "DROP_ALL" } as DropAllAction,
            { type: "MATCH_ALL" } as MatchAllAction,
          ],
        },
      } as CompositeAction);
    }

    setState({ ...state });
  }

  useEffect(() => {
    let update: number | null = null;

    async function frame() {
      await tick();

      update = requestAnimationFrame(frame);
    }

    update = requestAnimationFrame(frame);

    return () => {
      update && cancelAnimationFrame(update);
    };
  }, []);

  return (
    <GameContext.Provider
      value={{
        pause,
        reset,
        select,
        queueAction,
        state: { ...state, selection },
        debug: {
          next: tick,
        },
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
