import { useState } from "react";
import RoleSetter from "./RoleSetter";
import "../../styles/mafia/styles.css";

function Settings(props) {
  const roles = props.roles;
  const numPlayers = props.numPlayersHandler[0];
  const setNumPlayers = props.numPlayersHandler[1];
  const selectedRoles = props.selectedRolesHandler[0];
  const setSelectedRoles = props.selectedRolesHandler[1];

  const updateNumPlayers = event => {
    let num = parseInt(event.target.value);
    setNumPlayers(num);
  }

  return (
    <div class="settings">
      <div>
        <p>
          <h3>MAFIA: Settings</h3>
        </p>
        There are <input type="number" onChange={updateNumPlayers} /> players
      </div>
      <RoleSetter
        roles={roles}
        numPlayers={numPlayers}
        selectedRoles={selectedRoles}
        setSelectedRoles={setSelectedRoles}
      />
    </div>
  );
}

export default Settings;