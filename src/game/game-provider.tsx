import {
  createContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

import type { Action, Location } from "@/engine";

import { resolveAction } from "./actions";
import type { DropAllAction } from "./actions/drop-all";
import type { MatchAllAction } from "./actions/match-all";

import { TICK_RATE_MS, type GameContext as GameContextType } from ".";
import { populateBoard, type GameBoardSchema } from "./level-reader";
import { createBoard } from "@/engine/board";
import sleep from "@/utility/sleep";

type GameContextFeatures = {
  pause: () => void;
  reset: () => void;

  select: (location: Location | null) => void;
  queueAction: <T extends Action>(action: T) => void;

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
  };

  const [state, setState] = useState<Omit<GameContextState, "selection">>(
    (() => {
      const state = structuredClone(defaultState);

      populateBoard(state.board, schema);

      return state;
    })()
  );

  const [selection, setSelection] = useState<Location | null>(null);

  const actionQueue = useRef<Action[]>([]);

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
    actionQueue.current?.push(action);
  }

  useEffect(() => {
    let update: number | null = null;

    const tick = async () => {
      if (state.paused) {
        return;
      }

      const latestAction = actionQueue.current?.pop();

      // Make action available for UI
      setState({ ...state, currentAction: latestAction ?? null });

      await sleep(TICK_RATE_MS);

      // Resolve action
      if (latestAction) {
        resolveAction(state, latestAction);
      } else {
        actionQueue.current.push(
          { type: "DROP_ALL" } as DropAllAction,
          { type: "MATCH_ALL" } as MatchAllAction
        );
      }

      setState({ ...state });

      update = requestAnimationFrame(tick);
    };

    update = requestAnimationFrame(tick);

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
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
