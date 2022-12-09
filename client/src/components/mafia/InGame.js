import "../../styles/mafia/InGame.css"
import { useSelector } from 'react-redux';
import { useState } from "react";
import { ChatButton, AbilityButton, VoteButton, NotesButton, AlertsButton, AliveButton, DeadButton, MafiaButton } from "./SideButtons"
import RoleCard from "./RoleCard";
import SunIcon from "../../images/mafia/sun.png";
import MoonIcon from "../../images/mafia/moon.png";
import { getIcon } from "./getIcon";

function InGame(props) {
  const roles = props.roles;
  const teams = props.teams;
  // chat, vote, ability, notes, alerts 
  const [topScreen, setTopScreen] = useState("chat");
  // aliveList, deadList
  const [bottomScreen, setBottomScreen] = useState("aliveList");

  const notes = props.notes;
  const setNotes = props.setNotes;

  const lobbyState = useSelector((state) => state.lobbyState);
  const playerState = useSelector((state) => state.playerState);
  const playerRole = playerState.gamePlayerState.role;
  const executionerTargets = useSelector((state) => state.lobbyState.gameState.executionerTargets);
  const socket = props.socket;

  let roleCard = <RoleCard role={roles[playerRole]} />;

  // Pass in executioner target info if player is executioner
  if (executionerTargets.hasOwnProperty(playerState.id)) {
    const targetId = executionerTargets[playerState.id];
    const target = lobbyState.playerList.find(player => player.id === targetId);
    roleCard = <RoleCard role={roles[playerRole]} executionerTarget={target}/>
  }

  return (
    <div className="inGame">
      <MafiaHeader />
      <RoleList roles={roles} roleList={props.roleList} />
      <Phase
        roles={roles}
        teams={teams}
        topScreen={topScreen}
        setTopScreen={setTopScreen}
        bottomScreen={bottomScreen}
        setBottomScreen={setBottomScreen}
        notes={notes}
        setNotes={setNotes}
        socket={socket}
      />
      {roleCard}
    </div>
  );
}

function Phase(props) {
  const roles = props.roles;
  const teams = props.teams;
  const phase = useSelector((state) => state.lobbyState.gameState.currentPhase);
  const topScreen = props.topScreen;
  const setTopScreen = props.setTopScreen;
  const bottomScreen = props.bottomScreen;
  const setBottomScreen = props.setBottomScreen;
  const notes = props.notes;
  const setNotes = props.setNotes;
  const socket = props.socket;

  socket.on("mafia_night_phase_ended", (data) => {
    setTopScreen("alerts");
  });

  socket.on("mafia_day_phase_ended", (data) => {
    setTopScreen("alerts");
  });

  switch (phase) {
    case "day":
      return (
        <div className="phase">
          <DayPhase
            roles={roles}
            teams={teams}
            topScreen={topScreen}
            setTopScreen={setTopScreen}
            bottomScreen={bottomScreen}
            setBottomScreen={setBottomScreen}
            notes={notes}
            setNotes={setNotes}
            socket={socket}
          />
        </div>
      );
    case "night":
      return (
        <div className="phase">
          <NightPhase
            roles={roles}
            teams={teams}
            topScreen={topScreen}
            setTopScreen={setTopScreen}
            bottomScreen={bottomScreen}
            setBottomScreen={setBottomScreen}
            notes={notes}
            setNotes={setNotes}
            socket={socket} />
        </div>
      );
    default:
      return <div>Invalid game phase!</div>
  }
}

function DayPhase(props) {
  const roles = props.roles;
  const teams = props.teams;
  const topScreen = props.topScreen;
  const setTopScreen = props.setTopScreen;
  const bottomScreen = props.bottomScreen;
  const setBottomScreen = props.setBottomScreen;
  const notes = props.notes;
  const setNotes = props.setNotes;
  const socket = props.socket;

  return (
    <>
      <div className="mainInfo">
        <TopScreen roles={roles} teams={teams} screen={topScreen} notes={notes} setNotes={setNotes} socket={socket} />
        <BottomScreen roles={roles} screen={bottomScreen} />
      </div>
      <div className="sideButtons">
        <ChatButton setScreen={setTopScreen} />
        <VoteButton setScreen={setTopScreen} />
        <NotesButton setScreen={setTopScreen} />
        <AlertsButton setScreen={setTopScreen} />
        <hr />
        <AliveButton setScreen={setBottomScreen} />
        <DeadButton setScreen={setBottomScreen} />
        <MafiaButton setScreen={setBottomScreen} />
      </div>
    </>
  );
}

function NightPhase(props) {
  const roles = props.roles;
  const teams = props.teams;
  const topScreen = props.topScreen;
  const setTopScreen = props.setTopScreen;
  const bottomScreen = props.bottomScreen;
  const setBottomScreen = props.setBottomScreen;
  const notes = props.notes;
  const setNotes = props.setNotes;
  const socket = props.socket;

  return (
    <>
    <div className="mainInfo">
      <TopScreen roles={roles} teams={teams} screen={topScreen} notes={notes} setNotes={setNotes} socket={socket} />
      <BottomScreen roles={roles} screen={bottomScreen} />
    </div>
    <div className="sideButtons">
      <ChatButton setScreen={setTopScreen} />
      <AbilityButton roles={roles} setScreen={setTopScreen} />
      <NotesButton setScreen={setTopScreen} />
      <AlertsButton setScreen={setTopScreen} />
      <hr />
      <AliveButton setScreen={setBottomScreen} />
      <DeadButton setScreen={setBottomScreen} />
      <MafiaButton setScreen={setBottomScreen} />
    </div>
  </>
  );
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function MafiaHeader(props) {
  const gameState = useSelector((state) => state.lobbyState.gameState);
  const icon = gameState.currentPhase === "day" ? SunIcon : MoonIcon;

  return (
    <div className="mafiaHeader">
      <div className="mafiaHeaderContent">
        <span>{capitalizeFirst(gameState.currentPhase)}</span>
        <img src={icon} width="25px" height="25px" alt={capitalizeFirst(gameState.currentPhase)} />
        <span>
          {gameState.phaseNum}
        </span>
      </div>
    </div>
  );
}

function RoleList(props) {
  const roles = props.roles;
  const roleList = props.roleList;
  let roleCount = new Map();

  roleList.forEach(role => {
    if (roleCount.has(role)) {
      let prevCount = roleCount.get(role)
      roleCount.set(role, prevCount + 1);
    } else {
      roleCount.set(role, 1);
    }
  });

  const a = Array.from(roleCount).map(([key, value]) => (
    <div className="roleListItem">{value}x <img src={getIcon(roles[key].name)} alt={key} title={key} width="24px"/></div>)
    );

  return (
    <div className="roleList">
      {a}
    </div>
  );
}

function getTargetTypesFromAbility(ability) {
  switch (ability) {
    case "block":
      return [["alive"]];
    case "save":
      return [["alive", "self"]];
    case "kill":
      return [["alive"]];
    case "investigate":
      return [["alive"]];
    case "swap":
      return [["alive", "self"], ["alive", "self"]];
    case "ressurect":
      return [["dead"]];
    case "frame":
      return [["alive", "nonmafia"]];
    case "identify":
      return [["alive"]];
    default:
      return []; // no ability
  }
}

function getTargetFromTypesNotSelf(target, players, roles) {
  let list = [...players];

  for (let j = 0; j < target.length; j++) {
    const type = target[j];
    
    switch (type) {
      case "alive":
        list = list.filter(player => player.gamePlayerState.isAlive);
        break;
      case "dead":
        list = list.filter(player => !player.gamePlayerState.isAlive);
        break;
      case "mafia":
        list = list.filter(player => roles[player.gamePlayerState.role].team === "Mafia");
        break;
      case "nonmafia":
        list = list.filter(player => roles[player.gamePlayerState.role].team !== "Mafia");
        break;
      case "any":
        break;
      default:
        // pass
    }
  }
  return list;
}

function filterTargets(ability, allPlayers, selfPlayerState, roles) {
  const types = getTargetTypesFromAbility(ability);
  let results = [];

  for (let i = 0; i < types.length; i++) {
    const target = types[i];
    let list = [...allPlayers];

    list = getTargetFromTypesNotSelf(target, list, roles);

    if (target.includes("self")) {
      // Add self to targets if not already included
      if (!list.some(player => player.id === selfPlayerState.id)) {
        list.unshift(selfPlayerState);
      }
    } else {
      // Remove self from targets
      list = list.filter(player => player.id !== selfPlayerState.id);
    }
    results.push(list);
  }

  return results;
}

function doRoleAbility(socket, lobbyState, playerState, ability, targets) {
  const phaseNum = lobbyState.gameState.phaseNum;
  const playerId = playerState.id;
  // Write to history
  if (!lobbyState.gameState.history[phaseNum]) {
    lobbyState.gameState.history[phaseNum] = {
      night: {},
      day: {},
      mafiaVotes: {}
    };
  }

  // Now write the ability into the history
  const entry = {
    ability: ability,
    targets: targets
  };

  // Increment times used ability
  playerState.gamePlayerState.timesUsedAbility += 1;
  socket.emit("update_player_state", playerState);

  lobbyState.gameState.history[phaseNum].night[playerId] = entry;
  // Emit to server
  socket.emit("update_lobby_state", lobbyState);
  socket.emit("mafia_check_night_end", lobbyState.lobbyId);
}

function doMafiaVote(socket, lobbyState, voterId, choiceId) {
  const phaseNum = lobbyState.gameState.phaseNum;

  if (!lobbyState.gameState.history[phaseNum]) {
    lobbyState.gameState.history[phaseNum] = {
      night: {},
      day: {},
      mafiaVotes: {},
      mafiaKill: undefined
    };
  }

  // Record the vote
  lobbyState.gameState.history[phaseNum].mafiaVotes[voterId] = choiceId;
  // Emit to server
  socket.emit("update_lobby_state", lobbyState);
  socket.emit("mafia_check_night_end", lobbyState.lobbyId);
}

function doDayVote(socket, lobbyState, voterId, choiceId) {
  const phaseNum = lobbyState.gameState.phaseNum;

  if (!lobbyState.gameState.history[phaseNum]) {
    lobbyState.gameState.history[phaseNum] = {
      night: {},
      day: {},
      mafiaVotes: {},
      mafiaKill: undefined
    };
  }

  // Record the vote
  lobbyState.gameState.history[phaseNum].day[voterId] = choiceId;
  // Emit to server
  socket.emit("update_lobby_state", lobbyState);
  socket.emit("mafia_check_day_end", lobbyState.lobbyId);
}

function TopScreen(props) {
  const roles = props.roles;
  const teams = props.teams;
  const screen = props.screen;
  const notes = props.notes;
  const setNotes = props.setNotes;
  const socket = props.socket;

  switch (screen) {
    case "chat":
      return <Chat socket={socket} />
    case "vote":
      return <Vote socket={socket} />
    case "ability":
      return <Ability roles={roles} teams={teams} socket={socket} />
    case "notes":
      return <Notes socket={socket} notes={notes} setNotes={setNotes} />
    case "alerts":
      return <Alerts />
    default:
      return <Alerts />
  }
}

function Chat(props) {
  return (
    <div className="topScreen chatbox">
      Chat box
    </div>
  );
}

function Vote(props) {
  const playerState = useSelector((state) => state.playerState);
  const lobbyState = useSelector((state) => state.lobbyState);
  const players = useSelector((state) => state.lobbyState.playerList);
  const alivePlayers = players.filter(p => p.gamePlayerState.isAlive);
  const votes = lobbyState.gameState.history.hasOwnProperty([lobbyState.gameState.phaseNum]) ?
    lobbyState.gameState.history[lobbyState.gameState.phaseNum].day : {};
  const socket = props.socket;

  return (
    <div className="topScreen vote">
      {!lobbyState.playerList.find(p => p.id === playerState.id).gamePlayerState.isAlive ?
      <p>
        <b>You are dead and cannot vote.</b>
      </p>
      :
      <form>
        <label for="voteChoice"><b>You vote: </b></label>
        <select id="voteChoice">
          <option value="">No one</option>
          {alivePlayers.map((player) => (<option value={player.id}>{player.nickname}</option>))}
        </select>
        <br />
          <input type="button" value="OK" onClick={() =>
            doDayVote(socket, lobbyState, playerState.id, document.getElementById("voteChoice").value === "" ? null : document.getElementById("voteChoice").value)} />
      </form>}
      <div className="votes">
          <ul>
          {alivePlayers.map(voter =>
            <li key={voter.nickname}>
              {voter.nickname} <i>votes</i> {votes.hasOwnProperty(voter.id) ? 
                votes[voter.id] !== null ? players.find(p => p.id === votes[voter.id]).nickname : "No one" : ""}
            </li>
          )}
          </ul>
        </div>
    </div>
  );
}

function Ability(props) {
  const roles = props.roles;
  const teams = props.teams;
  const playerState = useSelector((state) => state.playerState);
  const lobbyState = useSelector((state) => state.lobbyState);
  const players = useSelector((state) => state.lobbyState.playerList);
  const phaseNum = lobbyState.gameState.phaseNum;
  const role = playerState.gamePlayerState.role;
  const socket = props.socket;

  function TeamAbilityDiv() {
    const targets = getTargetFromTypesNotSelf(["alive", "nonmafia"], players, roles);
    const votes = lobbyState.gameState.history.hasOwnProperty([lobbyState.gameState.phaseNum]) ?
      lobbyState.gameState.history[phaseNum].mafiaVotes : {};
    const mafiaMembers = lobbyState.playerList.filter(player => roles[player.gamePlayerState.role].team === "Mafia");
    const aliveMafiaPlayers = mafiaMembers.filter(player => player.gamePlayerState.isAlive);    
    console.log(mafiaMembers);

    return (
      <div className="abilityItem">
        <h3>{roles[role].team} Meeting</h3>
        {teams[roles[role].team].meetingAbility}
        <form>
          <label for="teamChoice"><b>You vote: </b></label>
          <select id="teamChoice">
            <option value="">No one (skip)</option>
            {targets.map((player) => (<option value={player.id}>{player.nickname}</option>))}
          </select>
          <br />
          <input type="button" value="OK" onClick={() =>
            doMafiaVote(socket, lobbyState, playerState.id, document.getElementById("teamChoice").value === "" ? null : document.getElementById("teamChoice").value)} />
        </form>
        <div className="mafiaVotes">
          <ul>
          {aliveMafiaPlayers.map(mafiaMember =>
            <li key={mafiaMember.nickname}>
              {mafiaMember.nickname} <i>votes</i> {votes.hasOwnProperty(mafiaMember.id) ? 
                votes[mafiaMember.id] !== null ? players.find(p => p.id === votes[mafiaMember.id]).nickname : "No one" : ""}
            </li>
          )}
          </ul>
        </div>
      </div>
    );
  }

  function IndividualAbilityDiv() {
    const ability = roles[playerState.gamePlayerState.role].ability;
    const targets = filterTargets(ability, players, playerState, roles);
    return (
      <div className="ability">
        <h3>{role} Ability</h3>
        {roles[role].abilityMessage}
        <br />
        <form id="abilityForm">
          <span><b>You choose: </b></span>
          {targets.map(
            (target, index) =>
            <select id={"abilityChoice" + index}>
              <option value="">No one (skip)</option>
              {target.map(player => 
                  <option value={player.id}>{player.nickname}</option>
              )}
            </select>
          )}
          <br />
          <input type="button" value="OK" 
            onClick={() => doRoleAbility(socket, lobbyState, playerState, ability,
              Array.from(document.getElementById("abilityForm").elements).filter(
                elem => elem.nodeName.toLowerCase() === "select"
              ).map(select => select.value === "" ? null : select.value)
              )}
          />
          {lobbyState.gameState.history.hasOwnProperty(phaseNum) && lobbyState.gameState.history[phaseNum].night.hasOwnProperty(playerState.id) ? 
            lobbyState.gameState.history[phaseNum].night[playerState.id].targets.map(
              (target, index) => <>{(index > 0 ? ", " : "") + (target === null ? "No one" : players.find(p => p.id === target).nickname)}</>) : ""}
        </form>
      </div>
    )
  };

  function NoAbilityDiv() {
    return (
      <div className="ability">
        You have no ability. Sweet dreams! <br />
        Press the OK button to continue.
        <form>
          <input type="button" value="OK" 
            onClick={() => doRoleAbility(socket, lobbyState, playerState, "ok", [])} />
        </form>
      </div>
    );
  }

  if (roles[role].ability === "ressurect" && playerState.gamePlayerState.timesUsedAbility > 0) {
    return (
      <div className="topScreen ability">
        <NoAbilityDiv />
      </div>
    );
  }

  // If dead, prevent from viewing ability screen.
  if (!lobbyState.playerList.find(p => p.id === playerState.id).gamePlayerState.isAlive) {
    return (
    <div className="topScreen ability">
      <p>
        <b>You are dead.</b>   
      </p>
      <p>
          Rest in Peace.
      </p>
    </div>
    );
  }

  return (
    <div className="topScreen ability">
      {
        roles[role].team === "Mafia" && roles[role].team && <TeamAbilityDiv />
      }
      {
        roles[role].ability && <IndividualAbilityDiv />
      }
      {
        roles[role].team !== "Mafia" && !roles[role].abilityMessage && <NoAbilityDiv />
      }
    </div>
  );
}

function Notes(props) {
  const notes = props.notes;
  const setNotes = props.setNotes;

  return (
    <div className="topScreen notes">
      <h4>Notes</h4>
      <textarea type="text" className="notesInput" rows="4" onChange={(text) => setNotes(text.target.value)} value={notes} />
    </div>
  );
}

function Alerts(props) {
  const lobbyState = useSelector((state) => state.lobbyState);
  const playerState = useSelector((state) => state.playerState);
  console.log("PLAYER:", playerState);

  return (
    <div className="topScreen alerts">
      {lobbyState.gameState.allPlayersMessage}
      <br />
      {lobbyState.playerList.find(p => p.id === playerState.id).gamePlayerState.isAlive ?
        (lobbyState.gameState.messages.hasOwnProperty(playerState.id) ? 
          lobbyState.gameState.messages[playerState.id] : "") : <b>You are dead.</b>}
    </div>
  );
}

function BottomScreen(props) {
  const roles = props.roles;
  const screen = props.screen;
  switch (screen) {
    case "aliveList":
      return <AliveList />
    case "deadList":
      return <DeadList roles={roles} />
    case "mafiaList":
      return <MafiaList roles={roles} />
    default:
      return <AliveList />
  }
}

function AliveList() {
  const lobbyState = useSelector((state) => state.lobbyState);
  // TODO: Check which players are alive
  const players = lobbyState.playerList;
  const alivePlayers = players.filter(player => player.gamePlayerState.isAlive);

  return (
    <div className="bottomScreen aliveList">
      <h3>Alive: {alivePlayers.length}</h3>
      <ul>
        {alivePlayers.map(player => {return <li key={player.id}>{player.nickname}</li>})}
      </ul>
    </div>
  )
}

function DeadList(props) {
  const roles = props.roles;
  const lobbyState = useSelector((state) => state.lobbyState);
  // TODO: Check which players are dead
  const players = lobbyState.playerList;
  const deadPlayers = players.filter(player => !player.gamePlayerState.isAlive);
  return (
    <div className="bottomScreen deadList">
      <h3>Dead: {deadPlayers.length}</h3>
      <ul>
        {deadPlayers.map(player => {return <li key={player.id}>
          <img src={getIcon(player.gamePlayerState.role)} alt={player.gamePlayerState.role} width="25px" /> {player.nickname}
        </li>})}
      </ul>
    </div>
  )
}

function MafiaList(props) {
  const roles = props.roles;
  const lobbyState = useSelector((state) => state.lobbyState);
  const playerState = useSelector((state) => state.playerState);
  
  if (roles[playerState.gamePlayerState.role].team !== "Mafia")
  {
    return (
      <div className="bottomScreen mafiaList">
      <h3>Mafia:</h3>
      You are not in the Mafia.
      </div>
    )
  }

  const mafiaPlayers = lobbyState.playerList.filter(player =>
    roles[player.gamePlayerState.role].team === "Mafia");

  return (
    <div className="bottomScreen mafiaList">
      <h3>Mafia: {mafiaPlayers.length}</h3>
      <ul>
        {mafiaPlayers.map(player => {
          return <li><img src={getIcon(roles[player.gamePlayerState.role].name)} alt={player.role} width="25px" /> {player.nickname}</li>
        })}
      </ul>
    </div>
  )
}

export default InGame;