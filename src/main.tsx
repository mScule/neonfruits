import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Game from "./Game.tsx";
import GameProvider from "./game/game-provider.tsx";

const root = document.querySelector("#root")!;

createRoot(root).render(
  <StrictMode>
    <div className="pt-5 w-full flex flex-col gap-3 items-center">
      <h1 className="text-violet-200 font-neon drop-shadow-lg drop-shadow-violet-800 text-3xl">
        neon fruits
      </h1>

      <GameProvider
        schema={[
          ["b", "a", ".", ".", "b", "b"],

          ["b", ".", "a", "b", "c", "b"],

          ["o", "b", ".", "a", "b", "c"],

          ["o", ".", ".", "a", "c", "a"],

          [".", "o", "a", ".", "c", "a"],
        ]}
      >
        <Game />
      </GameProvider>
    </div>
  </StrictMode>
);
