import { useState } from "react";
import RoleSetter from "./RoleSetter";
import "../../styles/mafia/styles.css";
import { useSelector } from "react-redux";

function Settings(props) {
  const roles = props.roles;
  const numPlayers = useSelector((state) => state.lobbyState.playerList).length;
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
        There are {numPlayers} players. Minimum 2 required.
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