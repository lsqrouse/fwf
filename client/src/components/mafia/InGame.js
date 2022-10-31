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

  const playerRole = useSelector((state) => state.playerState.role);

  return (
    <div className="inGame">
      <MafiaHeader />
      <RoleList roleList={props.roleList} />
      <Phase topScreen={topScreen} setTopScreen={setTopScreen} bottomScreen={bottomScreen} setBottomScreen={setBottomScreen} />
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

  switch (phase) {
    case "day":
      return (
        <div className="phase">
          <DayPhase topScreen={topScreen} setTopScreen={setTopScreen} bottomScreen={bottomScreen} setBottomScreen={setBottomScreen} />
        </div>
      );
    case "night":
      return (
        <div className="phase">
          <NightPhase topScreen={topScreen} setTopScreen={setTopScreen} bottomScreen={bottomScreen} setBottomScreen={setBottomScreen} />
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

  return (
    <>
      <div className="mainInfo">
        <TopScreen screen={topScreen} />
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
  return (
    <>
    <div className="mainInfo">
      <TopScreen screen={topScreen} />
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

function MafiaHeader(props) {
  const gameState = useSelector((state) => state.lobbyState.gameState);
  const icon = gameState.currentPhase === "day" ? SunIcon : MoonIcon;

  return (
    <div className="mafiaHeader">
      <div className="mafiaHeaderContent">
        <span>MAFIA</span>
        <img src={icon} width="25px" height="25px" alt={capitaliseFirst(gameState.currentPhase)} />
        <span>
          {gameState.phaseNum}
        </span>
      </div>
    </div>
  );
}

function capitaliseFirst(str) {
  return str.charAt(0).toUpperCase + str.slice(1);
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

function TopScreen(props) {
  const screen = props.screen;

  switch (screen) {
    case "chat":
      return <Chat />
    case "vote":
      return <Vote />
    case "ability":
      return <Ability />
    case "notes":
      return <Notes />
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
  const players = useSelector((state) => state.lobbyState.playerList);
  const role = playerState.role;

  function TeamAbilityDiv() {
    return (
      <div className="abilityItem">
        <h3>{roles[role].team} Meeting</h3>
        {teams[roles[role].team].meetingAbility}
        <form>
          <label for="teamChoice"><b>You vote: </b></label>
          <select name="teamChoice">
            <option value={null}>No one (skip)</option>
            {players.map((player) => (<option value={player.id}>{player.nickname}</option>))}
          </select>
          <br />
          <input type="submit" value="OK" />
        </form>
      </div>
    );
  }

  // TODO: Only make alive players selectable (unless player is ressurectionist)
  function IndividualAbilityDiv() {
    return (
      <div className="ability">
        <h3>{role} Ability</h3>
        {roles[role].abilityMessage}
        <br />
        <form>
          <label for="abilityChoice"><b>You choose: </b></label>
          <select name="abilityChoice">
            <option value={null}>No one (skip)</option>
            {players.map((player) => (<option value={player.id}>{player.nickname}</option>))}
          </select>
          <br />
          <input type="submit" value="OK" />
        </form>
      </div>
    )
  };

  return (
    <div className="topScreen ability">
      {
        roles[role].team === "Mafia" && roles[role].team && <TeamAbilityDiv />
      }
      {
        roles[role].abilityMessage && <IndividualAbilityDiv />
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
    if (player.isAlive === true) {
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
    if (player.isAlive == false) {
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

  if (playerState.role != "mafia")
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