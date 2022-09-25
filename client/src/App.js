import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Game from './pages/game';

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => setData(data.message))
  }, []);

  return (
    <div className="App">
      <Game/>
    </div>
  );
}

export default App;
