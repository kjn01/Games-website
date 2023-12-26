import { useState, useEffect } from "react";
import Space from "./Space";
import { socket } from '../socket';

export default function Column({ turn, changeTurn, game, setGame, col, code, localColor }) {
  const [currentLevel, setCurrentLevel] = useState(0);

  function changeCurrentLevel(level) {
    if (level === null) setCurrentLevel(currentLevel < 7 ? currentLevel + 1 : currentLevel);
    else setCurrentLevel(level < 7 ? level : 7);
  }

  const [colors, setColor] = useState(["white", "white", "white", "white", "white", "white"]);

  function changeColor() {
    changeTurn(null);
    const nextColors = colors.map((color, i) => {
      if (currentLevel === i) {
        return turn;
      }
      else if (color === "gray") {
        return "white";
      }
      else {
        return color
      }
    });
    setColor(nextColors);
    changeCurrentLevel(null);
  }

  useEffect(() => {
    socket.on("recieveBoard", (data) => {
      let nextColors = [];
      let changed = false;
      let tempLevel = 0;

      for (let i = data.board.length - 1; i >= 0; i--) {
        if (data.board[i][col - 1] !== game[i][col - 1]) {
          changed = true;
        }
        if (data.board[i][col - 1] === 0) nextColors.push("white");
        else if (data.board[i][col - 1] === 1) {
          nextColors.push("blue");
          tempLevel++;
        }
        else if (data.board[i][col - 1] === 2) {
          nextColors.push("red");
          tempLevel++;
        }
      }
      setColor(nextColors);
      if (changed) {
        changeCurrentLevel(tempLevel);
      }
    });
    
  }, []);

  function hover() {
    const nextColors = colors.map((color, i) => {
      
      if (color === "white") {
        if (currentLevel < i) {
          return "gray";
        }
        else if (currentLevel === i) {
          return localColor === "blue" ? "previewBlue" : "previewRed";
        }
        else return color;
      }
      else {
        return color;
      }
    });
    return nextColors;
  }

  function revertHover() {
    if (localColor === turn) {
      const nextColors = colors.map((color, i) => {
        if (currentLevel > i) {
          return color;
        }
        else return "white";
      });
      setColor(nextColors);
    }
  }

  let turnColor = colors.map((color, i) => {
    if (color === "white") return "white-space";
    else if (color === "blue") return "blue-space";
    else if (color === "red") return "red-space";
    else if (color === "gray") return "gray-space";
    else if (color === "previewBlue") return "preview-blue-space";
    else if (color === "previewRed") return "preview-red-space";
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
          localColor={localColor}
        />
      </td>);
  }

  return (
    <tr>{column}</tr>
  );
}