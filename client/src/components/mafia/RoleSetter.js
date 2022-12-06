import {useSelector} from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { getIcon } from "./getIcon";

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

  function removeRoleIndex(index) {
    let newRoles = [...selectedRoles];
    newRoles.splice(index, 1);
    setSelectedRoles(newRoles);
  }


  let roleCount = 0
  return (
    <div className="roleSetter">
      <Container>
        <Row>
          
        {isHost && <Col>
          <div id="chooseRolesDiv">
        CHOOSE:
        <br/>
        {props.roles && Object.keys(props.roles).map(key =>
          <Role role={props.roles[key]} addRole={addRole} />
        )}
      </div></Col>}
      <Col>
      <div id="selectedRolesDiv">
        SELECTED: {selectedRoles.length}
        <br/>
        {isHost && <>
        <button type="button" className="clearRolesButton mafiaButton2" onClick={clearRoles}>Clear all</button>
        <button type="button" className="suggestRolesbutton mafiaButton2" onClick={suggestRoles}>Suggest</button>
        </>}
        <SelectedRoles roles={props.roles} selectedRoles={selectedRoles} removeRoleIndex={removeRoleIndex} isHost={isHost} />
      </div>
      </Col>
        </Row>

      </Container>
      
    </div>
  );
}

function Role(props) {
  const role = props.role;
  let cn = "roleDiv";
  switch (role.team) {
    case "Village":
      cn += " villageRole";
      break;
    case "Mafia":
      cn += " mafiaRole";
      break;
    default:
      cn += " otherRole";
  }

  return (
    <div className={cn}>
      <img src={getIcon(role.name)} alt={role.name}/>
      <AddRoleButton roleName={role.name} addRole={props.addRole} />
      <div className="roleLabel">{role.name}</div>
    </div>
  );
}

function AddRoleButton(props) {
  return (
    <button type="button" className="addRoleButton" onClick={() => props.addRole(props.roleName)}>+</button>
  );
}

function SelectedRoles(props) {
  if (props.isHost) {
    return (
      <div id="selectedRoles">
        {
          props.selectedRoles && props.selectedRoles.map((roleName, index) =>
            <span onClick={() => props.removeRoleIndex(index)}>
              <img
                src={getIcon(roleName)}
                width="35px"
                alt={roleName}
                title={roleName}
              />
            </span>
          )
        }
      </div>
    );
  } else {
    return (
      <div>
        {
          props.selectedRoles && props.selectedRoles.map((roleName, index) =>
            <span>
              <img
                src={getIcon(roleName)}
                width="35px"
                alt={roleName}
                title={roleName}
              />
            </span>
          )
        }
      </div>
    );
  }
}

export default RoleSetter;