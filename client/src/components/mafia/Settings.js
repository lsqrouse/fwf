import { useState } from "react";
import PlayerIcon from "../../images/mafia/icons/player.png";
import VillagerIcon from "../../images/mafia/icons/villager.png";
import DetectiveIcon from "../../images/mafia/icons/detective.png";
import DoctorIcon from "../../images/mafia/icons/doctor.png";
import VigilanteIcon from "../../images/mafia/icons/vigilante.png"
import DrunkIcon from "../../images/mafia/icons/drunk.png"
import MafiaIcon from "../../images/mafia/icons/mafia.png";
import DistractorIcon from "../../images/mafia/icons/distractor.png"
import "../../styles/mafia/styles.css";

const roles = [
  { name: "Villager", image: VillagerIcon},
  { name: "Mafia", image: MafiaIcon},
  { name: "Detective", image: DetectiveIcon},
  { name: "Doctor", image: DoctorIcon},
  { name: "Vigilante", image: VigilanteIcon},
  { name: "Drunk", image: DrunkIcon},
  { name: "Distractor", image: DistractorIcon}
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
      setNumPlayers(parseInt(event.target.value));
  }
  
  function suggestRoles() {
    console.log("Num players = " + numPlayers)
    if (numPlayers < 4) {
      return;
    } else if (numPlayers == 4) {
      console.log("Four")
      setSelectedRoles(addRolesToList([], "Mafia", 1, "Villager", 3));
    } else if (numPlayers == 5) {
      setSelectedRoles(addRolesToList([], "Mafia", 1, "Villager", 4));
    } else if (numPlayers == 6) {
      setSelectedRoles(addRolesToList([], "Mafia", 1, "Detective", 1, "Villager", 3));
    } else {
      const numMafia = Math.ceil(numPlayers * 0.272);
      const numVillagers = numPlayers - numMafia - 2;
      let suggested = addRolesToList([],
        "Mafia", numMafia,
        "Villager", numVillagers,
        "Detective", 1,
        "Doctor", 1
        );

      if (numMafia >= 3) {
        suggested[suggested.indexOf("Mafia")] = "Distractor";
      }

      const villagePowerRoles = ["Drunk", "Vigilante"];

      if (numVillagers >= 6) {
        console.log("6 or more")
        for (let i = 0; i < numVillagers - 5; i++) {
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
    <div class="settingsBox">
      <div>
        There are <input type="number" onChange={handleNumPlayers} /> players
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
          width="35px"
          alt={roleName}
          title={roleName}
          />
        )
      }
    </div>
  );
}

export default Settings;