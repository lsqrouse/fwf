import { useState } from "react";
import PlayerIcon from "../../images/mafia/icons/player.png";
import VillagerIcon from "../../images/mafia/icons/villager.png";
import DetectiveIcon from "../../images/mafia/icons/detective.png";
import DoctorIcon from "../../images/mafia/icons/doctor.png";
import MafiaIcon from "../../images/mafia/icons/mafia.png";

import "../../styles/mafia/styles.css";

const roles = [
  { name: "Villager", image: VillagerIcon},
  { name: "Mafia", image: MafiaIcon},
  { name: "Detective", image: DetectiveIcon},
  { name: "Doctor", image: DoctorIcon}
];

function Settings() {
  return (
    <RoleSetter />
  );
}

function RoleSetter() {
  const [selectedRoles, setSelectedRoles] = useState(["Villager"]);
  const [numPlayers, setNumPlayers] = useState();

  function addRole(role) {
    setSelectedRoles(selectedRoles =>[...selectedRoles, role]);
  }

  function clearRoles() {
    setSelectedRoles([]);
  }

  const handleNumPlayers = event => {
      setNumPlayers(event.target.value);
  }
  
  function suggestRoles() {
    if (numPlayers >= 4) {
      console.log(numPlayers);
      switch (numPlayers) {
        case 4:
          console.log("asdsad");
          setSelectedRoles(["Villager", "Villager", "Villager", "Mafia"]);
          break;
        default:
          
      }
    }
  }

  return (
    <div>
      <div>
        There are <input type="number" onChange={handleNumPlayers} value={numPlayers} /> players
      </div>
      <div id="chooseRolesDiv">
        CHOOSE:
        {roles && roles.map(role =>
          <Role roleName={role.name} image={role.image} addRole={addRole} />
        )}
      </div>
      <div id="selectedRolesDiv">
        SELECTED: {selectedRoles.length}
        <button type="button" class="clearRolesButton" onClick={clearRoles}>Clear all</button>
        <button type="button" class="suggestRolesbutton" onClick={suggestRoles}>Suggest</button>
        <SelectedRoles selectedRoles={selectedRoles}/>
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
            roles.find(role => {return role.name === roleName}).image
          }
          width="40px"
          alt={roleName}
          title={roleName}
          />
        )
      }
    </div>
  );
}

export default Settings;