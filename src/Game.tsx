import useGame from "./game/use-game";
import Cell from "./game/components/cell";

function App() {
  const game = useGame();

  return (
    <div className="border-t border-violet-900 p-8 w-fit flex flex-col gap-5 justify-center items-center bg-gradient-to-t from-transparent to-violet-950 rounded-xl">
      <div className="flex flex-col gap-1">
        {game.state.board.map((columns, row) => (
          <div key={row} className="flex flex-row gap-1">
            {columns.map((cell, column) => (
              <Cell key={cell.id} location={{ row, column }} />
            ))}
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
