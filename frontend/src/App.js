import { useState } from 'react';
import './App.css';
import Board from './components/Board';
import { socket } from './socket';

export default function App() {

  const [code, setCode] = useState("");

  function joinGame() {
    if (code != "") {
      socket.emit("joinGame", {game: code});
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <input type='text' placeholder='Enter game code' onChange={(event) => setCode(event.target.value)} />
        <button onClick={joinGame}>Join game</button>
        <Board code={code} />
      </header>
    </div>
  );
}