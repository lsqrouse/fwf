import MafiaContainer from '../components/mafia/MafiaContainer';
import { Link } from 'react-router-dom';
import './game.css';


const Game = (props) => {
  return (
    <div id="game">
      <Header game={props.game} code={props.code} handleLeave={props.handleLeave} />
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
            <h1 id='gameTitle'>{props.game !== undefined && props.game.toUpperCase()}</h1>
          </div>
        </div>

        <div className="headerDiv3">
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
          <Link to="/Instructions">
            <li onClick={() => props.setJoined(true)}>Instructions</li>
          </Link>
          <Link to="/">
            <li onClick={props.handleLeave}>Back</li>
          </Link>
        </ul>
      </div>
    </div>
  );
}

export default Game;