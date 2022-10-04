import { useState } from "react";
import Settings from './Settings';

function MafiaContainer(props) {
  const [numPlayers, setNumPlayers] = useState(0);
  const [selectedRoles, setSelectedRoles] = useState(["Villager"]);
  const [gameScreen, setGameScreen] = useState("Settings");

  function startGame() {
    // TODO: check for invalid role list
    if (numPlayers > selectedRoles.length) {
      alert("Not enough roles selected!");
    } else if (numPlayers < selectedRoles.length) {
      alert("Too many roles selected!");
    } else {
      setGameScreen("Game")
    }
  }

  return (
    <>
    {
      (gameScreen === "Game" &&
        <GameScreen />)
      ||
      (gameScreen === "Settings" &&
        <SettingsScreen
          numPlayers={numPlayers}
          setNumPlayers={setNumPlayers}
          selectedRoles={selectedRoles}
          setSelectedRoles={setSelectedRoles}
          startGame={startGame}
        />)
    }
    </>
  );
}

function SettingsScreen(props) {
  const numPlayers = props.numPlayers;
  const setNumPlayers = props.setNumPlayers;
  const selectedRoles = props.selectedRoles;
  const setSelectedRoles = props.setSelectedRoles;
  const startGame = props.startGame;

  return (
    <>
      <Settings
      numPlayersHandler={[numPlayers, setNumPlayers]}
      selectedRolesHandler={[selectedRoles, setSelectedRoles]}
      />
      <div>
        <button type="button" class="startGameButton" onClick={startGame}>Start Game</button>
      </div>
    </>
  );
}

function GameScreen(props) {

  return (
    <>
      <h3>
        Mafia: In-Game
      </h3>
    </>
  );
}

export default MafiaContainer;