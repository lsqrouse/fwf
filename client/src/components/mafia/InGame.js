import "../../styles/mafia/InGame.css"
import { useSelector } from 'react-redux';
import { useState } from "react";
import { ChatButton, AbilityButton, VoteButton, NotesButton, AlertsButton, AliveButton, DeadButton } from "./SideButtons"
import RoleCard from "./RoleCard";
import roles from "../../data/mafia/roles";
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
      <RoleCard role={roles.find(r => r.name = playerRole)} />
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
      </div>
    </>
  );
}

function NightPhase(props) {
  const topScreen = props.topScreen;
  const setTopScreen = props.setTopScreen;
  const bottomScreen = props.bottomScreen;
  const setBottomScreen = props.setBottomScreen
  const time = new Date();
  time.setSeconds(time.getSeconds() + 600);

  return (
    <>
    <div className="mainInfo">
      <TopScreen props={topScreen} />
      <MyTimer expiryTimestamp={time} />
      <BottomScreen props={bottomScreen} />
    </div>
    <div className="sideButtons">
      <ChatButton setScreen={setTopScreen} />
      <AbilityButton setScreen={setTopScreen} />
      <NotesButton setScreen={setTopScreen} />
      <AlertsButton setScreen={setTopScreen} />
      <hr />
      <AliveButton setScreen={setBottomScreen} />
      <DeadButton setScreen={setBottomScreen} />
    </div>
  </>
  );
}

function MyTimer({ expiryTimestamp }) {
  const {
    seconds,
    isRunning,
  } = useTimer({ expiryTimestamp, onExpire: () => console.warn('Times Up') });

  return (
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: '100px'}}>
        <span>{seconds}</span>
      </div>
      <p>{isRunning ? 'Running' : 'Not running'}</p>
    </div>
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
        <span>
          {timer()}
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

  const a = Array.from(roleCount).map(([key, value]) => (<span>{value}x {key}</span>));

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
  return (
    <div className="topScreen vote">
      Vote who to eliminate
    </div>
  );
}

function Ability(props) {
  return (
    <div className="topScreen ability">
      Use your ability
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
  return (
    <div className="topScreen alerts">
      Alerts about events
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
    default:
      return <AliveList />
  }
}

function AliveList() {
  const lobbyState = useSelector((state) => state.lobbyState);
  // TODO: Check which players are alive
  const alivePlayers = lobbyState.playerList;

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
  const deadPlayers = lobbyState.playerList;

  return (
    <div className="bottomScreen deadList">
      <h3>Dead: {deadPlayers.length}</h3>
      <ul>
        {deadPlayers.map(player => {return <li>{player.nickname}</li>})}
      </ul>
    </div>
  )
}

export default InGame;