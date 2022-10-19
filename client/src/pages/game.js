import MafiaContainer from '../components/mafia/MafiaContainer';
import MenuButton from '../images/menu.png';

const Game = (props) => {
  return (
    <div id="game">
      <Header game={props.game} />
      <GameContainer game={props.game} />
    </div>
  );
};

const Header = (props) => {
  return (
    <div id="header">
      <div id="headerContent">
        <div className="headerDiv">
          <HamburgerMenuButton />
        </div>
        <div id="gameTitle" className="headerDiv">
          <h1>{props.game}</h1>
        </div>
        <div id="lobbyCode" className="headerDiv">
          Lobby code
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

const HamburgerMenuButton = (props) => {
  return (
    <img src={MenuButton} width="35px" alt="menu" id="menuButtonImage" />
  );
}

export default Game;