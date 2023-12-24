import '../App.css';

export default function Space({ level, 
                                currentLevel, 
                                turnColor, 
                                changeColor, 
                                setColor, 
                                col, 
                                game, 
                                setGame, 
                                turn, 
                                hover, 
                                revertHover }) {
  function update() {
    if (level > currentLevel) {
      changeColor();
      let nextGame = [];
      for (let i = 0; i < game.length; i++) {
        nextGame.push([]);
        for (let j = 0; j < game[i].length; j++) {
          if (currentLevel == game.length - i - 1 && col - 1 == j) {
            if (turn == "blue") nextGame[i].push(1);
            else nextGame[i].push(2);
          }
          else if (game[i][j] != 0) {
            nextGame[i].push(game[i][j]);
          }
          else {
            nextGame[i].push(0);
          }
        }
      }
      setGame(nextGame);
    }
  }

  function updateHover() {
    let colors = hover();
    const nextColors = colors.map((color, i) => {
      if (i > level - 1) {
        return "white";
      }
      else return color;
    });
    setColor(nextColors);
  }

  return (
    <div className={turnColor} onClick={update} onMouseEnter={updateHover} onMouseLeave={revertHover} />
  );
}