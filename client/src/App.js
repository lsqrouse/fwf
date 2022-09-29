
import logo from './logo.svg';
import './App.css';
import React from 'react';
import FrontPage from './FrontPage.tsx';
import Login from './Login.tsx';
import MainLobby from './MainLobby.tsx';
function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => setData(data.message))
  }, []);

  return (
    <div className="App">
      <MainLobby></MainLobby>
    </div>
  );
}

export default App;
