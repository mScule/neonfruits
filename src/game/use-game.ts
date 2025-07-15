import { useContext } from "react";
import createErrorMessage from "@/utility/create-error-message";

import { GameContext } from "./game-provider";

export default function useGame() {
  const features = useContext(GameContext);

  if (!features) {
    throw createErrorMessage(
      "useGame hook can only be used inside GameContext"
    );
  }

  return features;
}
