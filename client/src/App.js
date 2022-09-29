
import logo from './logo.svg';
import './App.css';
import React from 'react';
import FrontPage from './FrontPage.tsx';
import Login from './Login.tsx';
import MainLobby from './MainLobby.tsx';
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
      <FrontPage></FrontPage>
      <hr></hr>
      <Login></Login>
      <hr></hr>
      <MainLobby></MainLobby>
    </div>
  );
}

export default App;
