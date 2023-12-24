import { useEffect, useState } from 'react';
import './App.css';
import Board from './components/Board';

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>{!data ? "Loading..." : data}</p>
        <Board />
      </header>
    </div>
  );
}