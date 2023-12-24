import { useState } from "react";
import Column from "./Column";

export default function Board() {

  const [game, setGame] = useState([[0, 0, 0, 0, 0, 0, 0],
                                    [0, 0, 0, 0, 0, 0, 0],
                                    [0, 0, 0, 0, 0, 0, 0],
                                    [0, 0, 0, 0, 0, 0, 0],
                                    [0, 0, 0, 0, 0, 0, 0],
                                    [0, 0, 0, 0, 0, 0, 0]])


  const [turn, setTurn] = useState("blue");

  function changeTurn() {
    setTurn(turn == "blue" ? "red" : "blue");
  }

  function checkWin(player) {
    let consecutive;
    for (let i = 0; i < game.length; i++) {
      for (let j = 0; j < game[i].length - 3; j++) {
        consecutive = 0;
        for (let k = j; k < j + 4; k++) {
          if (game[i][k] == player) consecutive++;
          else consecutive = 0;
          if (consecutive == 4) {
            return true;
          }
        }
      }
    }

    for (let i = 0; i < game[0].length; i++) {
      for (let j = 0; j < game.length - 3; j++) {
        consecutive = 0;
        for (let k = j; k < j + 4; k++) {
          if (game[k][i] == player) consecutive++;
          else consecutive = 0;
          if (consecutive == 4) {
            return true;
          }
        }
      }
    }

    for (let i = 3; i < game.length; i++) {
      for (let j = 0; j < game[i].length - 3; j++) {
        consecutive = 0;
        for (let k = 0; k < 4; k++) {
          if (game[i - k][j + k] == player) consecutive++;
          else consecutive = 0;
          if (consecutive == 4) {
            return true;
          }
        }
      }
    }

    for (let i = 3; i < game.length; i++) {
      for (let j = game[i].length - 1; j >= 3; j--) {
        consecutive = 0;
        for (let k = 0; k < 4; k++) {
          if (game[i - k][j - k] == player) consecutive++;
          else consecutive = 0;
          if (consecutive == 4) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function restart() {
    setTurn("blue");
    setGame([[0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]);
  }

  let board = [];

  for (let i = 1; i <= 7; i++) {
    board.push(<Column turn={turn} changeTurn={changeTurn} game={game} setGame={setGame} col={i} />);
  }

  return (
    checkWin(1) ?
    <>
      <p className="blue-win">Blue wins</p>
      <button className="rematch" onClick={restart}>Rematch</button>
    </>
    : checkWin(2) ?
    <>
      <p className="red-win">Red wins</p>
      <button className="rematch" onClick={restart}>Rematch</button>
    </>
    :
    <table className="main-board">{board}</table>
  );
}