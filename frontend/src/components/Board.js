import { useState, useEffect } from "react";
import Column from "./Column";
import { socket } from "../socket";

export default function Board({ code, started }) {

  const [game, setGame] = useState([[0, 0, 0, 0, 0, 0, 0],
                                    [0, 0, 0, 0, 0, 0, 0],
                                    [0, 0, 0, 0, 0, 0, 0],
                                    [0, 0, 0, 0, 0, 0, 0],
                                    [0, 0, 0, 0, 0, 0, 0],
                                    [0, 0, 0, 0, 0, 0, 0]]);


  const [turn, setTurn] = useState("blue");

  const [localColor, setLocalColor] = useState(null);

  function changeTurn(newTurn) {
    if (newTurn === null) setTurn(turn === "blue" ? "red" : "blue");
    else setTurn(newTurn);
  }

  function checkWin(player) {
    let consecutive;
    for (let i = 0; i < game.length; i++) {
      for (let j = 0; j < game[i].length - 3; j++) {
        consecutive = 0;
        for (let k = j; k < j + 4; k++) {
          if (game[i][k] === player) consecutive++;
          else consecutive = 0;
          if (consecutive === 4) {
            return 1;
          }
        }
      }
    }

    for (let i = 0; i < game[0].length; i++) {
      for (let j = 0; j < game.length - 3; j++) {
        consecutive = 0;
        for (let k = j; k < j + 4; k++) {
          if (game[k][i] === player) consecutive++;
          else consecutive = 0;
          if (consecutive === 4) {
            return 1;
          }
        }
      }
    }

    for (let i = 3; i < game.length; i++) {
      for (let j = 0; j < game[i].length - 3; j++) {
        consecutive = 0;
        for (let k = 0; k < 4; k++) {
          if (game[i - k][j + k] === player) consecutive++;
          else consecutive = 0;
          if (consecutive === 4) {
            return 1;
          }
        }
      }
    }

    for (let i = 3; i < game.length; i++) {
      for (let j = game[i].length - 1; j >= 3; j--) {
        consecutive = 0;
        for (let k = 0; k < 4; k++) {
          if (game[i - k][j - k] === player) consecutive++;
          else consecutive = 0;
          if (consecutive === 4) {
            return 1;
          }
        }
      }
    }

    let tie = true;

    for (let i = 0; i < game.length; i++) {
      for (let j = 0; j < game[i].length; j++) {
        if (game[i][j] === 0) tie = false
      }
    }

    if (tie) return 0;

    return -1;
  }

  useEffect(() => {
    socket.on("recieveBoard", (data) => {
      let updatedBoard = data.board;
      let nextGame = [];
      for (let i = 0; i < updatedBoard[0].length; i++) {
        nextGame.push([]);
        for (let j = updatedBoard.length - 1; j >= 0; j--) {
          if (updatedBoard[j][i] === 0) nextGame[i].push("white");
          else if (updatedBoard[j][i] === 1) nextGame[i].push("blue");
          else if (updatedBoard[j][i] === 2) nextGame[i].push("red");
        }
      }
      setGame(data.board);
      changeTurn(data.turn === "blue" ? "red" : "blue");
    });
  }, []);

  const [rematchPrompt, setRematchPrompt] = useState("Rematch");

  function restart() {
    socket.emit("rematch", {game: code});
  }
  
  useEffect(() => {
    socket.on("assignColor", (data) => {
      setLocalColor(data);
    });
    socket.on("startRematch", (data) => {
      setTurn("blue");
      setGame([[0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0, 0]]);
    });
  });

  let board = [];

  for (let i = 1; i <= 7; i++) {
    board.push(<Column turn={turn} changeTurn={changeTurn} game={game} setGame={setGame} col={i} code={code} localColor={localColor} />);
  }

  return (
    !started ?
    <>
      <p className="title">Connect <span className="blue">4</span></p>
    </>
    : checkWin(1) === 1 ?
    <>
      <p className="blue-win">Blue wins</p>
      <button className="title-button" onClick={restart}>{rematchPrompt}</button>
    </>
    : checkWin(2) === 1 ?
    <>
      <p className="red-win">Red wins</p>
      <button className="title-button" onClick={restart}>{rematchPrompt}</button>
    </>
    : checkWin(1) === 0 ?
    <>
      <p className="tie">Tie</p>
      <button className="title-button" onClick={restart}>{rematchPrompt}</button>
    </>
    : turn === "blue" ?
    <>
    <table className="main-board">{board}</table>
    <div className="blue-turn-indicator" />
    </>
    :
    <>
    <table className="main-board">{board}</table>
    <div className="red-turn-indicator" />
    </>
  );
}