import MafiaContainer from '../components/mafia/MafiaContainer';

const Game = (props) => {
  return (
    <div id="game">
      <GameContainer game={props.game} socket={props.socket} />
    </div>
  );
};

const Header = (props) => {
  return (
    <div id="header">
      <div id="headerContent">

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

const GameContainer = (props) => {
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

const HamburgerMenu = (props) => {
  return (
    <div id="menu">
      <input id="menuButton" type="checkbox" />
      <label for="menuButton" />
      
      <div id="menuItems">
        <ul>
          <a href="./Instructions" target="_blank"><li>How to play</li></a>
          <li onClick={props.handleLeave}>Leave Lobby</li>
        </ul>
      </div>
    </div>
  );
}

export default Game;