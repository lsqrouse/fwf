import { useState } from "react";
import Settings from './Settings';
import InGame from './InGame';
import { useSelector } from "react-redux";
import "../../styles/mafia/reusable.css";
import { getIcon } from "./getIcon";

function MafiaContainer(props) {
  const numPlayers = useSelector((state) => state.lobbyState.playerList).length;;
  const selectedRoles = useSelector((state) => state.lobbyState.gameState.settings.selectedRoles);
  const gameScreen = useSelector((state) => state.lobbyState.gameState.gameScreen);
  const socket = props.socket;
  const lobbyState = useSelector((state) => state.lobbyState);
  const [warnMessage, setWarnMessage] = useState("");
  const minPlayers = 4;
  const [roles, setRoles] = useState({});
  const [teams, setTeams] = useState({})
  const [notes, setNotes] = useState("");

  // Get roles data from server.
  if (Object.keys(roles).length === 0 || Object.keys(teams).length === 0) {
    socket.emit("mafia_request_data", lobbyState.lobbyId);
  }

  socket.on("mafia_data", (data) => {
    setRoles(data.roles);
    setTeams(data.teams);
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
          teams={teams}
          roles={roles}
          roleList={selectedRoles}
          notes={notes}
          setNotes={setNotes} 
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
      ||
      (gameScreen === "EndGame" &&
      <EndGameScreen

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
          <button type="button" className="startGameButton mafiaButton1" onClick={startGame}>Start Game</button>
          <button type="button" className="endGameButton mafiaButton1" onClick={endGame}>End Game</button>
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
      <InGame roles={props.roles} teams={props.teams} roleList={props.roleList} notes={props.notes} setNotes={props.setNotes} socket={props.socket} />
    </>
  );
}

function EndGameScreen(props) {
  const gameState = useSelector((state) => state.lobbyState.gameState);

  return (
    <div className="endGame">
      <h2>
        {gameState.winningTeams.map((team, index) => 
          team + (index < gameState.winningTeams.length - 1 ? " and " : "")
        )} has won!
      </h2>
      <div className="endGameInfo">
        <WinningPlayers />
        <GameSummary />
      </div>
    </div>
  )
}

function WinningPlayers() {
  const gameState = useSelector((state) => state.lobbyState.gameState);

  return (
  <div className="winningPlayersDiv">
    <h3>Winners:</h3>
    <ul className="winningPlayersList">
      {gameState.winningPlayers.map(player =>
        <li key={player.id}>
          <img src={getIcon(player.gamePlayerState.role)} width="25px" alt={player.gamePlayerState.role}/>
          {player.nickname}
        </li>
      )}
    </ul>
  </div>
  );
}

function GameSummary() {
  const lobbyState = useSelector((state) => state.lobbyState);
  const history = lobbyState.gameState.history;

  function getPlayerFromId(id) {
    return lobbyState.playerList.find(player => player.id === id);
  }

  function DaySummary(props) {
    const phaseNum = props.phaseNum;
    const data = props.data;

    return (
      <div>
        <h6>Day {phaseNum}</h6>
        <ul>
          <li key="dayVote">
            {data.dayVote && data.dayVote !== null && data.dayVote !== "null" ? <b>{getPlayerFromId(data.dayVote).nickname}</b> : "No one"} was voted out.
          </li>
        </ul>
      </div>
    );
  }

  function NightSummary(props) {
    const phaseNum = props.phaseNum;
    const data = props.data;

    return (
      <div>
        <h6>Night {phaseNum}</h6>
        <ul>
          {Object.keys(data.night).map(playerId =>
            data.night[playerId].ability !== "ok" &&
            <li key={playerId}>
              <b>{getPlayerFromId(playerId).nickname}</b>
              &nbsp;went out to&nbsp;
              {data.night[playerId].ability}&nbsp;
              {data.night[playerId].targets.map((target, index) =>
                target !== null && target !== "null" &&
                <><b>{getPlayerFromId(target).nickname}</b>{index < data.night[playerId].targets.length - 1 ? ", " : "."}</>
              )}
            </li>
          )}
          
          {data.mafiaKill && data.mafiaKill !== null && data.mafiaKill !== "null" &&
            <li key="mafiaKill">
              The mafia went out to kill <b>{getPlayerFromId(data.mafiaKill).nickname}</b>.
            </li>
          }
        </ul>
      </div>
    );
  }

  function SummaryList() {
   return (
    Object.keys(history).map(phaseNum =>
      <>
        <NightSummary phaseNum={phaseNum} data={history[phaseNum]} />
        {history[phaseNum].hasOwnProperty("dayVote") && <DaySummary phaseNum={phaseNum} data={history[phaseNum]} />}
      </>
    )
   );
  }

  return (
  <div className="gameSummaryDiv">
    <h3>Summary:</h3>
    <SummaryList />
  </div>
  );
}

export default MafiaContainer;