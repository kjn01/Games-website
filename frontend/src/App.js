import { useEffect, useState } from 'react';
import './App.css';
import Board from './components/Board';
import { socket } from './socket';

export default function App() {

  const [code, setCode] = useState("");
  const [started, setStarted] = useState(false);
  const [joinPrompt, setJoinPrompt] = useState("Join game");

  function joinGame() {
    if (code !== "") {
      socket.emit("joinGame", {game: code});
      setJoinPrompt("Joined, waiting...");
    }
  }

  useEffect(() => {
    socket.on("startGame", (data) => {
      setStarted(true);
    });
  });


  return (
    !started ?
    <div className="App">
      <header className="App-header">
        <Board code={code} started={started} />
        <div className='flex-container'>
            <input className='title-input' type='text' placeholder='Enter game code' onChange={(event) => setCode(event.target.value)} />
            <button className='title-button' onClick={joinGame}>{joinPrompt}</button>
        </div>
      </header>
    </div>
    :
    <div className="App">
      <header className="App-header">
        <Board code={code} started={started} />
      </header>
    </div>
  );
}