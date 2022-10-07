import {useSelector} from 'react-redux';

function RoleSetter(props) {
  const numPlayers = useSelector((state) => state.lobbyState.playerList).length;
  // const numPlayers = props.numPlayers;
  const selectedRoles = props.selectedRoles;
  const setSelectedRoles = props.setSelectedRoles;

  const isHost = useSelector((state) => state.playerState.host);

  function addRole(role) {
    setSelectedRoles([...selectedRoles, role]);
  }

  function clearRoles() {
    setSelectedRoles([]);
  }
  
  function suggestRoles() {
    if (numPlayers < 4) {
      alert("Need more than three players!!");
      return;
    } else if (numPlayers == 4) {
      setSelectedRoles(addRolesToList([], "Mafia", 1, "Villager", 3));
    } else if (numPlayers == 5) {
      setSelectedRoles(addRolesToList([], "Mafia", 1, "Villager", 4));
    } else if (numPlayers == 6) {
      setSelectedRoles(addRolesToList([], "Mafia", 2, "Detective", 1, "Villager", 3));
    } else {
      const numMafia = Math.ceil(numPlayers * 0.272);
      const numVillagers = numPlayers - numMafia - 2;
      let suggested = addRolesToList([],
        "Mafia", numMafia,
        "Detective", 1,
        "Doctor", 1,
        "Villager", numVillagers
        );
      
      const mafiaPowerRoles = ["Distractor", "Framer"];

      if (numMafia >= 3) {
        for (let i = 0; i < numMafia; i++) {
          if (i >= mafiaPowerRoles.length) {
            break;
          }
          suggested[suggested.indexOf("Mafia")] = mafiaPowerRoles[i];
        }
      }

      const villagePowerRoles = ["Drunk", "Vigilante", "Ressurectionist"];

      if (numVillagers >= 6) {
        for (let i = 0; i < numVillagers; i++) {
          if (i >= villagePowerRoles.length) {
            break;
          }
          suggested[suggested.indexOf("Villager")] = villagePowerRoles[i];
        }
      }
      
      setSelectedRoles(suggested);
    }
  }

  function addRolesToList(list) {
    let newList = [...list];
    for (let i = 1; i < arguments.length; i += 2) {
      const role = arguments[i];
      const num = arguments[i + 1];
      for (let j = 0; j < num; j++) {
        newList.push(role);
      }
    }
    return newList;
  }

  return (
    <div class="roleSetter">
      {isHost && <div id="chooseRolesDiv">
        CHOOSE:
        <br/>
        {props.roles && props.roles.map(role =>
          <Role roleName={role.name} image={role.image} addRole={addRole} />
        )}
      </div>}
      <div id="selectedRolesDiv">
        SELECTED: {numPlayers}
        <br/>
        {isHost && <>
        <button type="button" class="clearRolesButton" onClick={clearRoles}>Clear all</button>
        <button type="button" class="suggestRolesbutton" onClick={suggestRoles}>Suggest</button>
        </>}
        <SelectedRoles roles={props.roles} selectedRoles={selectedRoles}/>
      </div>
    </div>
  );
}

function Role(props) {
  return (
    <div className="roleDiv">
      <img src={props.image} alt={props.roleName} width="35px" />
      {props.roleName}
      <AddRoleButton roleName={props.roleName} addRole={props.addRole} />
    </div>
  );
}

function AddRoleButton(props) {
  return (
    <button type="button" class="addRoleButton" onClick={() => props.addRole(props.roleName)}>+</button>
  );
}

function SelectedRoles(props) {
  return (
    <div>
      {
        props.selectedRoles && props.selectedRoles.map(roleName =>
          <img
          src={
            props.roles.find(role => {return role.name === roleName}).image
          }
          width="35px"
          alt={roleName}
          title={roleName}
          />
        )
      }
    </div>
  );
}

export default RoleSetter;