import { useState } from "react";
import RoleSetter from "./RoleSetter";
import "../../styles/mafia/styles.css";
import { useSelector } from "react-redux";

function Settings(props) {
  const roles = props.roles;
  const numPlayers = useSelector((state) => state.lobbyState.playerList).length;
  const selectedRoles = props.selectedRoles;
  const setSelectedRoles = props.setSelectedRoles;

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
        socket={props.socket}
      />

      <div>
        <input type="text" id="dayTime" name="frameName"></input>
          <button id="frameButton" onClick={() => {
            var fname = document.getElementById("dayTime");
            var time = fname.value;
            //handleDayPhaseTime(time);
          }}>Set day phase time in seconds </button>

          <input type="text" id="nightPhaseTime" name="frameName"></input>
          <button id="frameButton" onClick={() => {
            var fname = document.getElementById("nightPhaseTime");
            var time = fname.value;
            //handleNightPhaseTime(time);
          }}>Set night phase time in seconds </button>
      </div>

    </div>
  );
}

export default Settings;