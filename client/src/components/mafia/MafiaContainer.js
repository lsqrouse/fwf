import { useState } from "react";
import Settings from './Settings';
import InGame from './InGame';
import { useSelector } from "react-redux";

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
  const numPlayers = useSelector((state) => state.lobbyState.playerList).length;;
  const [selectedRoles, setSelectedRoles] = useState(["Villager"]);
  const [gameScreen, setGameScreen] = useState("Settings");
  const [socket, setSocket] = useState(props.socket);
  const lobbyState = useSelector((state) => state.lobbyState);
  const minPlayers = 2;

  function startGame() {
    // TODO: check for invalid role list
    setNumPlayers(lobbyState.playerList.length);
    console.log(lobbyState.playerList.length);
    console.log("NUM PLAYERS %d", numPlayers);
    const playersNow = lobbyState.playerList.length;
    if(playersNow < minPlayers) {
      alert("not enough players in game");
    }else if (playersNow > selectedRoles.length) {
      alert("Not enough roles selected!");
    } else if (playersNow < selectedRoles.length) {
      alert("Too many roles selected!");
    } else {
      setGameScreen("Game")
    }
    //setGameScreen("Game")
    console.log("starting game socketemit")
    var startData = {
      lobbyId: lobbyState.lobbyId,
      selectedRoles: selectedRoles,
    }
    socket.emit("start_game", startData)
  }

  function endGame() {
    socket.emit("end_game", lobbyState)
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
          selectedRoles={selectedRoles}
          setSelectedRoles={setSelectedRoles}
          startGame={startGame}
          endGame={endGame}
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
  const endGame = props.endGame;

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
      <div>
        <button type="button" class="endGameButton" onClick={endGame}>End Game</button>
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