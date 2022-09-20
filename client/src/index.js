import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SyncTesting from './pages/synchTesting';
import Home from './pages/Home';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router> 
      <Routes>
        <Route exact path="/" element={<App/>}></Route>
        <Route exact path="/sync" element={<SyncTesting/>}/>
        <Route exact path="/home" element={<Home/>}/>
      </Routes>
    </Router> 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
