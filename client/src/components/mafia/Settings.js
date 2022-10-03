import { useState } from "react";
import PlayerIcon from "../../images/mafia/icons/player.png";
import VillagerIcon from "../../images/mafia/icons/villager.png";
import DetectiveIcon from "../../images/mafia/icons/detective.png";
import DoctorIcon from "../../images/mafia/icons/doctor.png";
import VigilanteIcon from "../../images/mafia/icons/vigilante.png"
import DrunkIcon from "../../images/mafia/icons/drunk.png"
import MafiaIcon from "../../images/mafia/icons/mafia.png";
import DistractorIcon from "../../images/mafia/icons/distractor.png"
import ExecutionerIcon from "../../images/mafia/icons/executioner.png";
import FramerIcon from "../../images/mafia/icons/framer.png";
import RessurectionistIcon from "../../images/mafia/icons/ressurectionist.png";
import "../../styles/mafia/styles.css";

const roles = [
  { name: "Villager", image: VillagerIcon},
  { name: "Mafia", image: MafiaIcon},
  { name: "Detective", image: DetectiveIcon},
  { name: "Doctor", image: DoctorIcon},
  { name: "Vigilante", image: VigilanteIcon},
  { name: "Drunk", image: DrunkIcon},
  { name: "Distractor", image: DistractorIcon},
  { name: "Executioner", image: ExecutionerIcon},
  { name: "Framer", image: FramerIcon},
  { name: "Ressurectionist", image: RessurectionistIcon}
];

function Settings() {
  const [numPlayers, setNumPlayers] = useState();
  const handleNumPlayers = event => {
    setNumPlayers(parseInt(event.target.value));
  }

  return (
    <div>
      <div>
        There are <input type="number" onChange={handleNumPlayers} /> players
      </div>
      <button type="button" class="startGameButton" onClick={startGame}>Start Game</button>
      <RoleSetter numPlayers={numPlayers} />
    </div>
  );
}

function startGame() {
  // TODO: check for invalid role list
  alert("Started the game!");
}

function RoleSetter(props) {
  const [selectedRoles, setSelectedRoles] = useState(["Villager"]);

  function addRole(role) {
    setSelectedRoles(selectedRoles =>[...selectedRoles, role]);
  }

  function clearRoles() {
    setSelectedRoles([]);
  }
  
  function suggestRoles() {
    if (props.numPlayers < 4) {
      return;
    } else if (props.numPlayers == 4) {
      setSelectedRoles(addRolesToList([], "Mafia", 1, "Villager", 3));
    } else if (props.numPlayers == 5) {
      setSelectedRoles(addRolesToList([], "Mafia", 1, "Villager", 4));
    } else if (props.numPlayers == 6) {
      setSelectedRoles(addRolesToList([], "Mafia", 2, "Detective", 1, "Villager", 3));
    } else {
      const numMafia = Math.ceil(props.numPlayers * 0.272);
      const numVillagers = props.numPlayers - numMafia - 2;
      let suggested = addRolesToList([],
        "Mafia", numMafia,
        "Detective", 1,
        "Doctor", 1,
        "Villager", numVillagers
        );

      if (numMafia >= 3) {
        suggested[suggested.indexOf("Mafia")] = "Distractor";
      }

      const villagePowerRoles = ["Drunk", "Vigilante"];

      if (numVillagers >= 6) {
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
    <div class="roleSetter">
      <div id="chooseRolesDiv">
        CHOOSE:
        <br/>
        {roles && roles.map(role =>
          <Role roleName={role.name} image={role.image} addRole={addRole} />
        )}
      </div>
      <div id="selectedRolesDiv">
        SELECTED: {selectedRoles.length}
        <br/>
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