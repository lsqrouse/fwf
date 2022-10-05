import { useState } from "react";
import Settings from './Settings';
import InGame from './InGame';

import PlayerIcon from "../../images/mafia/icons/player.png";
import VillagerIcon from "../../images/mafia/icons/villager.png";
import DetectiveIcon from "../../images/mafia/icons/detective.png";
import DoctorIcon from "../../images/mafia/icons/doctor.png";
import VigilanteIcon from "../../images/mafia/icons/vigilante.png"
import DrunkIcon from "../../images/mafia/icons/drunk.png"
import MafiaIcon from "../../images/mafia/icons/mafia.png";
import DistractorIcon from "../../images/mafia/icons/distractor.png"
import ExecutionerIcon from "../../images/mafia/icons/executioner.png";
import FramerIcon from "../../images/mafia/icons/framer.png";
import RessurectionistIcon from "../../images/mafia/icons/ressurectionist.png";
import roles from "../../data/mafia/roles";

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
        <GameScreen
          roles={roles}
          roleList={selectedRoles}
        />)
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
        roles={roles}
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
      <InGame roleList={props.roleList} />
    </>
  );
}

export default MafiaContainer;