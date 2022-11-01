import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Provider } from 'react-redux';
import SyncTesting from './pages/synchTesting.tsx';
import Home from './pages/Home';
import Account from './pages/Account.tsx';
import FrontPage from './FrontPage.tsx';
import UserPage from './pages/UserPage.tsx';
import Login from './Login.tsx'; 
import MainLobby from './MainLobby.tsx';
import Instructions from './Instructions.tsx';
import MafiaContainer from './components/mafia/MafiaContainer';
import store from './redux/store'



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store} >
    <link rel="stylesheet" href= "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"/>
     <Router> 
      <Routes>
        <Route exact path="/" element={<App/>}></Route>
        <Route exact path="/Login" element={<Login />} />
        <Route exact path="Instructions" element={<Instructions />} />
        <Route exact path="FrontPage" element={<FrontPage />} /> 
        <Route exact path="MainLobby" element={<MainLobby serverInfo={store.lobbyState}/>} /> 
        <Route exact path="/sync" element={<SyncTesting/>}/>
        <Route exact path="/home" element={<Home/>}/>
        <Route exact path="/account" element={<Account/>}/>
        <Route exact path="/u/:userId" element={<UserPage/>}/>

        <Route exact path="/mafia" element={<MafiaContainer/>}/>

        
      </Routes>
    </Router>
  </Provider> 
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
