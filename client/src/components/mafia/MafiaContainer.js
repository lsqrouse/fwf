import { useState } from "react";
import Settings from './Settings';
import InGame from './InGame';
import { useSelector } from "react-redux";
import roles from "../../data/mafia/roles";

function MafiaContainer(props) {
  const numPlayers = useSelector((state) => state.lobbyState.playerList).length;;
  const selectedRoles = useSelector((state) => state.lobbyState.settings.selectedRoles);
  const gameScreen = useSelector((state) => state.lobbyState.gameScreen);
  const [socket, setSocket] = useState(props.socket);
  const lobbyState = useSelector((state) => state.lobbyState);
  const [warnMessage, setWarnMessage] = useState("");
  const minPlayers = 4;

  function startGame() {
    // TODO: check for invalid role list
    //setNumPlayers(lobbyState.playerList.length);
    console.log(lobbyState.playerList.length);
    console.log("NUM PLAYERS %d", numPlayers);
    if (numPlayers < minPlayers) {
      setWarnMessage("Need at least " + minPlayers + " players.");
    } else {
      const check = checkRoleList();
      if (!check.valid) {
        setWarnMessage(check.message);
      } else {
        if (check.message === "OK" || (warnMessage !== "")) {
          console.log("starting game socketemit");
          var startData = {
            lobbyId: lobbyState.lobbyId,
            selectedRoles: selectedRoles,
          }
          socket.emit("start_game", startData);
        } else {
          setWarnMessage(check.message + " Game can still be started.");
        }
      }
    }
  }

  function checkRoleList() {
    let mafia = 0;
    let village = 0;
    let other = 0;
    for (let i = 0; i < selectedRoles.length; i++) {
      const roleName = selectedRoles[i];
      switch (getTeam(roleName)) {
        case "Mafia":
          mafia++;
          break
        case "Village":
          village++;
          break
        default:
          other++;
      }
    }
    if (selectedRoles.length > numPlayers) {
      return {message: "Not enough roles selected!", valid: false};
    }
    if (selectedRoles.length < numPlayers) {
      return {message: "Too few roles selected!", valid: false};
    }
    if (village === 0) {
      return {message: "At least one Village role must be selected.", valid: false};
    }
    if (mafia === 0) {
      return {message: "At least one Mafia role must be selected.", valid: false};
    }
    if (mafia >= village - 1) {
      return {message: "It is recommended to select more Village roles!", valid: true};
    }
    if (numPlayers > 8 && mafia < 3) {
      return {message: "It is recommended to select more Mafia roles!", valid: true};
    }
    return {message: "OK", valid: true};
  }

  function getTeam(roleName) {
    const role = roles.find(r => r.name === roleName);
    return role.team;
  }

  function updateSelectedRoles(roles) {
    const newSelectedRoles = roles;
    lobbyState.settings.selectedRoles = newSelectedRoles;
    socket.emit("update_lobby_state", lobbyState);
    setWarnMessage("");
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
          setSelectedRoles={updateSelectedRoles}
          startGame={startGame}
          endGame={endGame}
          warnMessage={warnMessage}
          socket={socket}
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
  const isHost = useSelector((state) => state.playerState.host);
  const warnMessage = props.warnMessage;
  const socket = props.socket;

  return (
    <>
      <Settings
        roles={roles}
        numPlayers={numPlayers}
        setNumPlayers={setNumPlayers}
        selectedRoles={selectedRoles}
        setSelectedRoles={setSelectedRoles}
        socket={socket}
      />
      {isHost && <>
        <div>
        <input type="text" id="dayTime" name="frameName"></input>
          <button id="frameButton" onClick={() => {
            var fname = document.getElementById("dayTime");
            var time = fname.value;
            //handleDayPhaseTime(time);
          }}>Set day phase time in seconds </button>

          <input type="text" id="nightPhaseTime" name="frameName"></input>
          <button id="frameButton" onClick={() => {
            var fname = document.getElementById("nightPhaseTime");
            var time = fname.value;
            //handleNightPhaseTime(time);
          }}>Set night phase time in seconds </button>
      </div>
      <div>
        <button type="button" class="startGameButton" onClick={startGame}>Start Game</button>
      </div>
      <div>
        <button type="button" class="endGameButton" onClick={endGame}>End Game</button>
      </div>
      <div id="warnMessage">{warnMessage}</div>
      </>}
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