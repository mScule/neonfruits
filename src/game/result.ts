import type { GameContext } from "@/game";
import type { ActionResult } from "@/engine";

export function setResult(context: GameContext, result: null | ActionResult) {
  context.result = result;
}

export function getResult<T extends ActionResult, K extends T["type"]>(
  context: GameContext,
  key: K
) {
  if (!context.result) {
    return null;
  }

  if (context.result.type !== key) {
    return null;
  }

  return context.result as T;
}
