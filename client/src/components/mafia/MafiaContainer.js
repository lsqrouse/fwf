import { useState } from "react";
import Settings from './Settings';
import InGame from './InGame';
import { useSelector } from "react-redux";
import "../../styles/mafia/reusable.css";

function MafiaContainer(props) {
  const numPlayers = useSelector((state) => state.lobbyState.playerList).length;;
  const selectedRoles = useSelector((state) => state.lobbyState.gameState.settings.selectedRoles);
  const gameScreen = useSelector((state) => state.lobbyState.gameState.gameScreen);
  const socket = props.socket;
  const lobbyState = useSelector((state) => state.lobbyState);
  const [warnMessage, setWarnMessage] = useState("");
  const minPlayers = 4;
  let roles = {};

  // Get roles data from server.
  socket.emit("mafia_request_roles_data");

  socket.on("mafia_roles_data", (data) => {
    roles = data;
  });

  function startGame() {
    console.log("NUM PLAYERS %d", numPlayers);
    // Only start the game if the number of roles and players is good.
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
          // Start the game as the number of roles and players is good.
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
      switch (roles[roleName].team) {
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
    if (selectedRoles.length < numPlayers) {
      return {message: "Not enough roles selected!", valid: false};
    }
    if (selectedRoles.length > numPlayers) {
      return {message: "Too many roles selected!", valid: false};
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

  function updateSelectedRoles(newRoles) {
    const newSelectedRoles = newRoles;
    lobbyState.gameState.settings.selectedRoles = newSelectedRoles;
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
          socket={socket}
        />)
      ||
      (gameScreen === "Settings" &&
        <SettingsScreen
          roles={roles}
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
  const roles = props.roles;
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
    <div className="settingsScreen">

      <div>
        There are {numPlayers} players. Minimum 4 required.
      </div>

      {isHost &&
        <>
          <button type="button" class="startGameButton mafiaButton1" onClick={startGame}>Start Game</button>
          <button type="button" class="endGameButton mafiaButton1" onClick={endGame}>End Game</button>
          <div id="warnMessage">
            {warnMessage}
          </div>
        </>
      }

      <Settings
        roles={roles}
        numPlayers={numPlayers}
        setNumPlayers={setNumPlayers}
        selectedRoles={selectedRoles}
        setSelectedRoles={setSelectedRoles}
        socket={socket}
      />
    </div>
  );
}

function GameScreen(props) {
  return (
    <>
      <InGame roles={props.roles} roleList={props.roleList} socket={props.socket} />
    </>
  );
}

export default MafiaContainer;