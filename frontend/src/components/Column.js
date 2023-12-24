import { useState } from "react";
import Space from "./Space";

export default function Column({ turn, changeTurn, game, setGame, col }) {
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
        />
      </td>);
  }

  return (
    <tr>{column}</tr>
  );
}