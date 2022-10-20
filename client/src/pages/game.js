import MafiaContainer from '../components/mafia/MafiaContainer'
import CoupContainer from '../components/coup/CoupContainer'

const Game = (props) => {
  if (props.game === "Mafia") 
  {
    return (
    <MafiaContainer socket={props.socket} />
    );
  }
  else if (props.game === "Coup")
  {
    return (
      <CoupContainer socket={props.socket} />
      );
  } 
  else 
  {
    return (
      <p>Please choose a game</p>
    );
  }
};

export default Game;