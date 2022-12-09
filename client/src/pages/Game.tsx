import MafiaContainer from '../components/mafia/MafiaContainer.js';
import React, { useState, useEffect, useMemo} from 'react';

type gameProps = {
  game: any
  code: any
  handleLeave: any
  socket: any

}
export default function Game(props: gameProps)  {
  return (
    <div id="game">
      <GameContainer game={props.game} socket={props.socket} />
    </div>
  );
};

function Header(props) {
  return (
    <div id="header">
      <div id="mafiaHeaderContent">

        <div className="headerDiv">
          <HamburgerMenu handleLeave={props.handleLeave}/>
        </div>

        <div className="headerDiv">
          <div id="gameTitle">
            <h1>{props.game !== undefined && props.game.toUpperCase()}</h1>
          </div>
        </div>

        <div className="headerDiv">
          <div id="lobbyCode">
            {props.code}
          </div>
        </div>

      </div>
    </div>
  );
}

function GameContainer(props) {
  if (props.game === "Mafia") {
    return (
    <MafiaContainer socket={props.socket} />
    );
  } else {
    return (
      <p>Please choose a game</p>
    );
  }
}

function HamburgerMenu(props){
  return (
    <div id="menu">
      <input id="menuButton" type="checkbox" />
      <label htmlFor="menuButton" />
      
      <div id="menuItems">
        <ul>
          <a href="./Instructions" target="_blank"><li>How to play</li></a>
          <li onClick={props.handleLeave}>Leave Lobby</li>
        </ul>
      </div>
    </div>
  );
}