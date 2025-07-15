import { useState } from "react";
import type { Location } from "./engine";

import type { FlipAction } from "./game/actions/flip";
import useGame from "./game/use-game";
import { LuApple, LuBanana, LuCherry } from "react-icons/lu";
import { PiOrange } from "react-icons/pi";
import clsx from "clsx";

function App() {
  const game = useGame();

  const [selection, setSelection] = useState<Location | null>(null);

  return (
    <div className="border-t border-violet-900 p-8 w-fit flex flex-col gap-5 justify-center items-center bg-gradient-to-t from-transparent to-violet-950 rounded-xl">
      <div className="flex flex-col gap-1">
        {game.state.board.map((columns, row) => (
          <div className="flex flex-row gap-1">
            {columns.map((cell, column) => {
              const isSelected =
                selection?.row === row && selection.column === column;
              const isNextToSelected =
                (selection?.row === row + 1 && selection?.column === column) || // is above
                (selection?.row === row - 1 && selection?.column === column) || // is below
                (selection?.row === row && selection?.column === column + 1) || // is left
                (selection?.row === row && selection?.column === column - 1); // is right

              return cell.value === "empty" ? (
                <div
                  id={cell.id}
                  key={cell.id}
                  className="w-10 h-10"
                  onClick={() => {
                    if (selection && !isNextToSelected && !isSelected) {
                      return;
                    }

                    if (!selection) {
                      setSelection({ row, column });
                    } else {
                      const action: FlipAction = {
                        type: "FLIP",
                        payload: {
                          from: selection,
                          to: { row, column },
                        },
                      };
                      game.queueAction(action);
                      setSelection(null);
                    }
                  }}
                />
              ) : (
                <div
                  id={cell.id}
                  key={cell.id}
                  className={clsx(
                    "cursor-pointer transition ease-in-out rounded-2xl"
                  )}
                  onClick={() => {
                    if (selection && !isNextToSelected && !isSelected) {
                      return;
                    }

                    if (!selection) {
                      setSelection({ row, column });
                    } else if (
                      selection.row === row &&
                      selection.column === column
                    ) {
                      setSelection(null);
                    } else {
                      const action: FlipAction = {
                        type: "FLIP",
                        payload: {
                          from: selection,
                          to: { row, column },
                        },
                      };

                      game.queueAction(action);
                      setSelection(null);
                    }
                  }}
                >
                  {
                    {
                      apple: (
                        <div
                          className={clsx(
                            "drop-shadow-green-500 w-10 h-10 border-2 rounded-2xl border-green-300 font-bold text-center text-2xl flex flex-row justify-center items-center drop-shadow-md transition ease-in",
                            selection &&
                              !isNextToSelected &&
                              !isSelected &&
                              "border-transparent"
                          )}
                        >
                          <LuApple className="text-green-300" />
                        </div>
                      ),
                      orange: (
                        <div
                          className={clsx(
                            "drop-shadow-orange-500 w-10 h-10 border-2 rounded-2xl border-orange-300 font-bold text-center text-2xl flex flex-row justify-center items-center drop-shadow-md transition ease-in",
                            selection &&
                              !isNextToSelected &&
                              !isSelected &&
                              "border-transparent"
                          )}
                        >
                          <PiOrange className="text-orange-300" size={32} />
                        </div>
                      ),
                      banana: (
                        <div
                          className={clsx(
                            "drop-shadow-yellow-500 w-10 h-10 border-2 rounded-2xl font-bold text-center text-2xl flex flex-row justify-center items-center drop-shadow-md transition ease-in",
                            selection && !isNextToSelected && !isSelected
                              ? "border-transparent"
                              : "border-yellow-300"
                          )}
                        >
                          <LuBanana className="text-yellow-300" />
                        </div>
                      ),
                      cherry: (
                        <div
                          className={clsx(
                            "drop-shadow-red-500 w-10 h-10 border-2 rounded-2xl border-red-300 font-bold text-center text-2xl flex flex-row justify-center items-center drop-shadow-md transition ease-in",
                            selection &&
                              !isNextToSelected &&
                              !isSelected &&
                              "border-transparent"
                          )}
                        >
                          <LuCherry className="text-red-300" />
                        </div>
                      ),
                    }[cell.value]
                  }
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="text-violet-200 font-neon drop-shadow-lg drop-shadow-violet-800 flex flex-row justify-between w-full">
        <span>score: {game.state.score}</span>
        <span>moves: {game.state.moves}</span>
      </div>
    </div>
  );
}

export default App;
