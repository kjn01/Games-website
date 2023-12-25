import { useState, useEffect } from "react";
import Space from "./Space";
import { socket } from '../socket';

let transfer = false;
let updatedBoard = [];
let nextGame = [];

export default function Column({ turn, changeTurn, game, setGame, col, code }) {
  const [currentLevel, setCurrentLevel] = useState(0);

  function changeCurrentLevel() {
    setCurrentLevel(currentLevel < 7 ? currentLevel + 1 : currentLevel);
  }

  const [colors, setColor] = useState(["white", "white", "white", "white", "white", "white"]);

  function changeColor() {
    changeTurn();
    const nextColors = colors.map((color, i) => {
      if (currentLevel == i) {
        return turn;
      }
      else {
        return color;
      }
    });
    setColor(nextColors);
    changeCurrentLevel();
  }

  useEffect(() => {
    socket.on("recieveBoard", (data) => {
      if (turn == "red") {
        transfer = true;
        updatedBoard = data.board;
        // alert(data.board);
        nextGame = [];
        for (let i = 0; i < updatedBoard[0].length; i++) {
          let gameCol = [];
          let updatedCol = [];
          for (let j = 0; j < game.length; j++) {
            gameCol.push(game[j][i]);
          }
          for (let j = 0; j < updatedBoard.length; j++) {
            updatedCol.push(updatedBoard[j][i]);
          }
          // console.log("GAME: " + gameCol);
          // console.log("UPDATED: " + updatedCol);
          if (JSON.stringify(gameCol) != JSON.stringify(updatedCol)) {
            console.log("col" + i);
            for (let j = updatedBoard.length - 1; j >= 0; j--) {
              if (updatedBoard[j][i] == 0) nextGame.push("white");
              else if (updatedBoard[j][i] == 1) nextGame.push("blue");
              else if (updatedBoard[j][i] == 2) nextGame.push("red");
            }
          }
        }
        return () => {
          socket.disconnect();
        }
      }
    });
  }, []);

  if (transfer) {
    console.log("before");
    console.log(updatedBoard);
    console.log(game);

    setColor(nextGame);
    setGame(updatedBoard);

    console.log("after");
    console.log(updatedBoard);
    console.log(game);
    transfer = false;
  }
  function hover() {
    const nextColors = colors.map((color, i) => {
      if (currentLevel < i) {
        return "gray";
      }
      else if (currentLevel == i) {
        return turn == "blue" ? "previewBlue" : "previewRed";
      }
      else {
        return color;
      }
    });
    return nextColors;
  }

  function revertHover() {
    const nextColors = colors.map((color, i) => {
      if (currentLevel > i) {
        return color;
      }
      else return "white";
    });
    setColor(nextColors);
  }

  let turnColor = colors.map((color, i) => {
    if (color == "white") return "white-space";
    else if (color == "blue") return "blue-space";
    else if (color == "red") return "red-space";
    else if (color == "gray") return "gray-space";
    else if (color == "previewBlue") return "preview-blue-space";
    else if (color == "previewRed") return "preview-red-space";
  });

  let column = [];

  for (let i = 6; i >= 1; i--) {
    column.push(
      <td>
        <Space
          level={i}
          currentLevel={currentLevel}
          turnColor={turnColor[i - 1]}
          changeColor={changeColor}
          setColor={setColor}
          col={col}
          game={game}
          setGame={setGame}
          turn={turn}
          hover={hover}
          revertHover={revertHover}
          code={code}
        />
      </td>);
  }

  return (
    <tr>{column}</tr>
  );
}