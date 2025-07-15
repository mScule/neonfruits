import {
  createContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

import type { Action } from "@/engine";

import { resolveAction } from "./actions";
import type { CompositeAction } from "./actions/composite";
import type { DropAllAction } from "./actions/drop-all";
import type { MatchAllAction } from "./actions/match-all";

import { TICK_RATE_MS, type GameContext as GameContextType } from ".";
import { populateBoard, type GameBoardSchema } from "./level-reader";
import { createBoard } from "@/engine/board";

type GameContextFeatures = {
  pause: () => void;
  reset: () => void;

  queueAction: <T extends Action>(action: T) => void;

  state: GameContextState;
};

type GameContextState = GameContextType & {
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
    paused: false,
  };

  const [state, setState] = useState<GameContextState>(
    (() => {
      const state = structuredClone(defaultState);

      populateBoard(state.board, schema);

      return state;
    })()
  );

  const actionQueue = useRef<Action[]>([]);

  function pause() {
    setState({ ...state, paused: !state.paused });
  }

  function reset() {
    const state = structuredClone(defaultState);

    populateBoard(state.board, schema);

    setState({ ...state });
  }

  function queueAction<T extends Action>(action: T) {
    actionQueue.current?.push(action);
  }

  useEffect(() => {
    const tick = setInterval(() => {
      if (state.paused) {
        return;
      }

      const latestActions: CompositeAction = {
        type: "COMPOSITE",
        payload: {
          actions: [
            { type: "DROP_ALL" } as DropAllAction,
            { type: "MATCH_ALL" } as MatchAllAction,
          ],
        },
      };

      const latestAction = actionQueue.current?.pop();

      if (latestAction) {
        latestActions.payload.actions.push(latestAction);
      }

      resolveAction(state, latestActions);

      setState({ ...state });
    }, TICK_RATE_MS);

    return () => clearInterval(tick);
  }, []);

  return (
    <GameContext.Provider value={{ pause, reset, queueAction, state }}>
      {children}
    </GameContext.Provider>
  );
}
