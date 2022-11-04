import { useState } from "react";
import RoleSetter from "./RoleSetter";
import { useSelector } from "react-redux";

function Settings(props) {
    const roles = props.roles;
    const numPlayers = useSelector((state) => state.lobbyState.playerList).length;
    const selectedRoles = props.selectedRoles;
    const setSelectedRoles = props.setSelectedRoles;

    return (
        <div>
            <RoleSetter
                roles={roles}
                numPlayers={numPlayers}
                selectedRoles={selectedRoles}
                setSelectedRoles={setSelectedRoles}
                socket={props.socket}
            />
        </div>
    );
}

export default Settings;