import MafiaContainer from '../components/mafia/MafiaContainer'

const Game = (props) => {
  if (props.game === "Mafia") {
    return (
    <MafiaContainer />
    );
  } else {
    return (
      "Unknown game \"" + props.state.game + "\"" 
    );
  }
};

export default Game;