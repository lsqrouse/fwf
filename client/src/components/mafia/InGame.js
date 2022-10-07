import "../../styles/mafia/InGame.css"
import { useSelector } from 'react-redux';
import { useState } from "react";
import { ChatButton, AbilityButton, VoteButton, NotesButton, AlertsButton, AliveButton, DeadButton } from "./SideButtons"
import RoleCard from "./RoleCard";
import roles from "../../data/mafia/roles";

function InGame(props) {
  // chat, vote, ability, notes, alerts 
  const [topScreen, setTopScreen] = useState("chat");
  // aliveList, deadList
  const [bottomScreen, setBottomScreen] = useState("aliveList");

  // TODO: feed in player's actual role stored in server to the RoleCard component.

  return (
    <div className="inGame">
      <RoleList roleList={props.roleList} />
      <DayPhase setTopScreen={setTopScreen} setBottomScreen={setBottomScreen} />
      <RoleCard role={roles[0]} />
    </div>
  );

}

function DayPhase(props) {
  const setTopScreen = props.setTopScreen;
  const setBottomScreen = props.setBottomScreen

  return (
    <div className="phase">
      <div className="mainInfo">
        <Chat />
        <AliveList />
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
    </div>
  );
}

function NightPhase(props) {
  const setTopScreen = props.setTopScreen;
  const setBottomScreen = props.setBottomScreen

  return (
    <>
    <div className="mainInfo">
      <Chat />
      <AliveList />
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

function Chat(props) {
  return (
    <div className="chatbox">
      Chat box
    </div>
  );
}

function AliveList(props) {
  const lobbyState = useSelector((state) => state.lobbyState);
  // TODO: Check which players are alive
  const alivePlayers = lobbyState.playerList;

  return (
    <div className="aliveList">
      <h3>Alive: {alivePlayers.length}</h3>
      <ul>
        {alivePlayers.map(player => {return <li>{player.nickname}</li>})}
      </ul>
    </div>
  )
}

export default InGame;