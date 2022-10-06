import MafiaContainer from '../components/mafia/MafiaContainer'

const Game = (props) => {
  if (props.game === "Mafia") {
    return (
    <MafiaContainer socket={props.socket} />
    );
  } else {
    return (
      <p>Please choose a game</p>
    );
  }
};

export default Game;