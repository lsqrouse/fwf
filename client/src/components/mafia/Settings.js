import { useState } from "react";
import RoleSetter from "./RoleSetter";
import "../../styles/mafia/styles.css";
import { useSelector } from "react-redux";
import TimerSettings from "./TimerSettings";

function Settings(props) {
  const roles = props.roles;
  const numPlayers = useSelector((state) => state.lobbyState.playerList).length;
  const selectedRoles = props.selectedRoles;
  const setSelectedRoles = props.setSelectedRoles;
  const [settingsTab, setSettingsTab] = useState("roles");

  return (
    <div class="settings">
      <div>
        <p>
          <h3>Settings</h3>
        </p>
        There are {numPlayers} players. Minimum 4 required.
      </div>

      <div className="settingsTabs">
        <button className={"mafiaButton1" + (settingsTab === "roles" ? " mafiaPrimary" : "")} onClick={() => setSettingsTab("roles")}>Roles</button>
        <button className={"mafiaButton1" + (settingsTab === "timer" ? " mafiaPrimary" : "")} onClick={() => setSettingsTab("timer")}>Timers</button>
      </div>
      
      {
      settingsTab === "roles" ?
      <RoleSetter
        roles={roles}
        numPlayers={numPlayers}
        selectedRoles={selectedRoles}
        setSelectedRoles={setSelectedRoles}
        socket={props.socket}
      />
      :
      settingsTab === "timer" ?
      <TimerSettings />
      :
      <></>
      }
    </div>
  );
}

export default Settings;