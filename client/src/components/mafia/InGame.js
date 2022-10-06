import "../../styles/mafia/InGame.css"

function InGame(props) {
  // Placeholder
  const alivePlayers = ["Jamie", "Quinn", "Kartik", "Brian", "Rob"];

  return (
    <div className="inGame">
      <RoleList roleList={props.roleList} />
      <Chat />
      <AliveList alivePlayers={alivePlayers} />
      <RoleCardTab />
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
const alivePlayers = props.alivePlayers;

  return (
    <div className="aliveList">
      <h3>Alive: {alivePlayers.length}</h3>
      <ul>
        {alivePlayers.map(name => {return <li>{name}</li>})}
      </ul>
    </div>
  )
}

function RoleCardTab(props) {
  return (
    <div className="roleCardTab">
      ROLE
    </div>
  );
}

export default InGame;