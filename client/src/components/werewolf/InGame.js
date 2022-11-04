import { useState } from 'react';
import { useSelector } from 'react-redux';

function inGame(props) {
    const playerRole = useSelector((state) => state.playerState.gamePlayerState.role);
    return (
        <div>
            <RoleCard role={roles[playerRole]} />
        </div>
    );
}
export default inGame;