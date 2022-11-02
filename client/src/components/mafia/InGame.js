import "../../styles/mafia/InGame.css"
import { useSelector } from 'react-redux';
import { useState } from "react";
import { ChatButton, AbilityButton, VoteButton, NotesButton, AlertsButton, AliveButton, DeadButton, MafiaButton } from "./SideButtons"
import RoleCard from "./RoleCard";
import roles from "../../data/mafia/roles";
import teams from "../../data/mafia/teams";
import SunIcon from "../../images/mafia/sun.png";
import MoonIcon from "../../images/mafia/moon.png";

function InGame(props) {
  // chat, vote, ability, notes, alerts 
  const [topScreen, setTopScreen] = useState("chat");
  // aliveList, deadList
  const [bottomScreen, setBottomScreen] = useState("aliveList");

  const playerRole = useSelector((state) => state.playerState.gamePlayerState.role);
  const socket = props.socket;

  return (
    <div className="inGame">
      <MafiaHeader />
      <RoleList roleList={props.roleList} />
      <Phase topScreen={topScreen} setTopScreen={setTopScreen} bottomScreen={bottomScreen} setBottomScreen={setBottomScreen} socket={socket} />
      <RoleCard role={roles[playerRole]} />
    </div>
  );
}

function Phase(props) {
  const phase = useSelector((state) => state.lobbyState.gameState.currentPhase);
  const topScreen = props.topScreen;
  const setTopScreen = props.setTopScreen;
  const bottomScreen = props.bottomScreen;
  const setBottomScreen = props.setBottomScreen;
  const socket = props.socket;

  switch (phase) {
    case "day":
      return (
        <div className="phase">
          <DayPhase topScreen={topScreen} setTopScreen={setTopScreen} bottomScreen={bottomScreen} setBottomScreen={setBottomScreen} socket={socket} />
        </div>
      );
    case "night":
      return (
        <div className="phase">
          <NightPhase topScreen={topScreen} setTopScreen={setTopScreen} bottomScreen={bottomScreen} setBottomScreen={setBottomScreen} socket={socket} />
        </div>
      );
    default:
      return <div>Invalid game phase!</div>
  }
}

function DayPhase(props) {
  const topScreen = props.topScreen;
  const setTopScreen = props.setTopScreen;
  const bottomScreen = props.bottomScreen;
  const setBottomScreen = props.setBottomScreen
  const socket = props.socket;

  return (
    <>
      <div className="mainInfo">
        <TopScreen screen={topScreen} socket={socket} />
        <BottomScreen screen={bottomScreen} />
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
  const topScreen = props.topScreen;
  const setTopScreen = props.setTopScreen;
  const bottomScreen = props.bottomScreen;
  const setBottomScreen = props.setBottomScreen;
  const socket = props.socket;

  return (
    <>
    <div className="mainInfo">
      <TopScreen screen={topScreen} socket={socket} />
      <BottomScreen screen={bottomScreen} />
    </div>
    <div className="sideButtons">
      <ChatButton setScreen={setTopScreen} />
      <AbilityButton setScreen={setTopScreen} />
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
    <div class="roleListItem">{value}x <img src={roles[key].image} alt={key} title={key} width="24px"/></div>)
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
    default:
      return []; // no ability
  }
}

function getTargetFromTypesNotSelf(target, players) {
  let list = [...players];

  for (let j = 0; j < target.length; j++) {
    const type = target[j];
    
    switch (type) {
      case "alive":
        list = list.filter(player => player.gamePlayerState.isAlive);
        break;
      case "dead":
        list = list.filter(player => player);
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

function filterTargets(ability, allPlayers, selfPlayerState) {
  const types = getTargetTypesFromAbility(ability);
  let results = [];

  for (let i = 0; i < types.length; i++) {
    const target = types[i];
    let list = [...allPlayers];

    list = getTargetFromTypesNotSelf(target, list);

    if (target.includes("self")) {
      // Add self to targets if not already included
      if (!list.includes(selfPlayerState)) {
        selfPlayerState.unshift(selfPlayerState);
      }
    } else {
      // Remove self from targets
      list = list.filter(player => player.id !== selfPlayerState.id);
    }
    results.push(list);
  }

  return results;
}

function doRoleAbility(socket, lobbyState, playerId, ability, targets) {
  const phase = lobbyState.gameState.currentPhase;
  const phaseNum = lobbyState.gameState.phaseNum;
  // Write to history
  if (!lobbyState.gameState.history) {
    // Create a new history if none exists
    lobbyState.gameState.history = {};
  }
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
  lobbyState.gameState.history[phaseNum][phase][playerId] = entry;
  // Emit to server
  socket.emit("update_lobby_state", lobbyState);
}

function doMafiaVote(socket, lobbyState, voterId, choiceId) {
  const phaseNum = lobbyState.gameState.phaseNum;
  if (!lobbyState.gameState.history) {
    // Create a new history if none exists
    lobbyState.gameState.history = {};
  }
  if (!lobbyState.gameState.history[phaseNum]) {
    lobbyState.gameState.history[phaseNum] = {
      night: {},
      day: {},
      mafiaVotes: {}
    };
  }

  // Record the vote
  lobbyState.gameState.history[phaseNum].mafiaVotes[voterId] = choiceId;
  // Emit to server
  socket.emit("update_lobby_state", lobbyState);
}

function TopScreen(props) {
  const screen = props.screen;
  const socket = props.socket;

  switch (screen) {
    case "chat":
      return <Chat socket={socket} />
    case "vote":
      return <Vote socket={socket} />
    case "ability":
      return <Ability socket={socket} />
    case "notes":
      return <Notes socket={socket} />
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
  const players = useSelector((state) => state.lobbyState.playerList);

  return (
    <div className="topScreen vote">
      <form>
        <label for="voteChoice"><b>You vote:</b></label>
        <select name="voteChoice">
          <option value={null}></option>
          {players.map((player) => (<option value={player.id}>{player.nickname}</option>))}
        </select>
      </form>
    </div>
  );
}

function Ability(props) {
  const playerState = useSelector((state) => state.playerState);
  const lobbyState = useSelector((state) => state.lobbyState);
  const players = useSelector((state) => state.lobbyState.playerList);
  const role = playerState.gamePlayerState.role;
  const socket = props.socket;

  function TeamAbilityDiv() {
    const targets = getTargetFromTypesNotSelf(["dead", "nonmafia"], players);;

    return (
      <div className="abilityItem">
        <h3>{roles[role].team} Meeting</h3>
        {teams[roles[role].team].meetingAbility}
        <form>
          <label for="teamChoice"><b>You vote: </b></label>
          <select id="teamChoice">
            <option value={null}>No one (skip)</option>
            {targets.map((player) => (<option value={player.id}>{player.nickname}</option>))}
          </select>
          <br />
          <input type="button" value="OK" onClick={() =>
            doMafiaVote(socket, lobbyState, playerState.id, document.getElementById("teamChoice").value)} />
        </form>
      </div>
    );
  }

  function IndividualAbilityDiv() {
    // TODO: Make it possible to get the values of TWO select fields
    const ability = roles[playerState.gamePlayerState.role].ability;
    const targets = filterTargets(ability, players, playerState);
    return (
      <div className="ability">
        <h3>{role} Ability</h3>
        {roles[role].abilityMessage}
        <br />
        <form id="abilityForm">
          <span><b>You choose: </b></span>
          {targets.map(
            (target, index) =>
            <select is={"abilityChoice" + index}>
              <option value={null}>No one (skip)</option>
              {target.map(player => 
                  <option value={player.id}>{player.nickname}</option>
              )}
            </select>
          )}
          <br />
          <input type="button" value="OK" 
            onClick={() => doRoleAbility(socket, lobbyState, playerState.id, ability,
              Array.from(document.getElementById("abilityForm").elements).filter(
                elem => elem.nodeName.toLowerCase() === "select"
              ).map(select => select.value)
              )}
          />
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
          <input type="button" value="OK" />
        </form>
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
  return (
    <div className="topScreen notes">
      Notes go here
    </div>
  );
}

function Alerts(props) {
  const lobbyState = useSelector((state) => state.lobbyState);

  return (
    <div className="topScreen alerts">
      {lobbyState.gameState.allPlayersMessage}
    </div>
  );
}

function BottomScreen(props) {
  const screen = props.screen;
  switch (screen) {
    case "aliveList":
      return <AliveList />
    case "deadList":
      return <DeadList />
    case "mafiaList":
      return <MafiaList />
    default:
      return <AliveList />
  }
}

function AliveList() {
  const lobbyState = useSelector((state) => state.lobbyState);
  // TODO: Check which players are alive
  const players = lobbyState.playerList;
  const alivePlayers = [];
  for (const player of players) {
    if (player.gamePlayerState.isAlive === true) {
      alivePlayers.push(player);
    }
  }
  return (
    <div className="bottomScreen aliveList">
      <h3>Alive: {alivePlayers.length}</h3>
      <ul>
        {alivePlayers.map(player => {return <li>{player.nickname}</li>})}
      </ul>
    </div>
  )
}

function DeadList() {
  const lobbyState = useSelector((state) => state.lobbyState);
  // TODO: Check which players are dead
  const players = lobbyState.playerList;
  const deadPlayers = [];
  for (const player of players) {
    if (player.gamePlayerState.isAlive == false) {
      deadPlayers.push(player);
    }
  }
  return (
    <div className="bottomScreen deadList">
      <h3>Dead: {deadPlayers.length}</h3>
      <ul>
        {deadPlayers.map(player => {return <li>{player.nickname}</li>})}
      </ul>
    </div>
  )
}

function MafiaList() {
  const lobbyState = useSelector((state) => state.lobbyState);
  const playerState = useSelector((state) => state.playerState);
  // TODO: Check which players are dead
  const mafiaPlayers = lobbyState.gameState.mafiaList;

  if (playerState.gamePlayerState.role != "mafia")
  {
    return (
      <div className="bottomScreen mafiaList">
      <h3>Sorry, you're not in the mafia.</h3>
      </div>
    )
  }

  return (
    <div className="bottomScreen mafiaList">
      <h3>Mafia: {mafiaPlayers.length}</h3>
      <ul>
        {mafiaPlayers.map(player => {return <li>{player.nickname}</li>})}
      </ul>
    </div>
  )
}

export default InGame;