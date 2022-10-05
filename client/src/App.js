
import logo from './logo.svg';
import './App.css';
import React from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SyncTesting from './pages/synchTesting.tsx';
import FrontPage from './FrontPage.tsx';
import Login from './Login.tsx';
import MainLobby from './MainLobby.tsx';
import Game from './pages/game';
import RoleCard from './components/mafia/RoleCard'

const testRole = {
  name: "Mafia",
  team: "Mafia",
  winCondition: "Eliminate the Village!",
  actions: "Each night, vote with the other Mafia to pick who to kill."
}

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => setData(data.message))
  }, []);

  return (
    <>
    <div className="App">
      <RoleCard role={testRole} />
    </div>

    </>
  );
}

export default App;
