import { useState } from "react";
import { useSelector } from "react-redux";
import roles from "../../data/coup/roles";
import "../../styles/coup/CoupContainer.css"

// Coup container
function CoupContainer(props) 
{
  const numPlayers = useSelector((state) => state.lobbyState.playerList).length;
  const selectedRoles = useSelector((state) => state.lobbyState.settings.selectedRoles);
  const [socket, setSocket] = useState(props.socket);
  const lobbyState = useSelector((state) => state.lobbyState);
  const gameVersion = lobbyState.coupGameState.gameVersion;
  const gameStarted = lobbyState.coupGameState.gameStarted;
  const gameEnded = lobbyState.coupGameState.gameEnded;
  const minPlayers = 2;

  // Start game function
  function startGame() 
  {
    // If at least two players then start
    if (numPlayers >= minPlayers)
    {
        var startData = 
        {
            lobbyId: lobbyState.lobbyId,
            selectedRoles: selectedRoles,
        }
        socket.emit("start_coup_game", startData);
    }
  }

  // End game function
  function endGame() 
  {
    socket.emit("end_coup_game", lobbyState);
  }

  // Go to different game mode
  function nextGameVersion()
  {
    socket.emit("coup_next_game_version", lobbyState);
  }

  return (
    <>
    {
        <div className="coupContainer">
            <CoupHeader/>
            <div class="parent">
                <RoleList roleList={roles} gameVersion={gameVersion}/>
                <SettingStuff startGame={startGame} endGame={endGame} nextGameVersion={nextGameVersion}/>
            </div>
      </div>
    }
    </>
  );
}

// Coup header
function CoupHeader(props) 
{
    return (
        <div className="coupHeaderContent">
            <span>COUP</span>
        </div>
    );
}

// Roles for coup
function RoleList(props) 
{
    // Get role list based on game version
    const gameVersion = props.gameVersion;
    const roleList = props.roleList[gameVersion];
    const a = Array.from(roleList, (value) => (<span>{value.name} <br/> </span>));
  
    return (
      <div className="roleList">
        {a}
      </div>
    );
}

// Settings for coup
function SettingStuff(props) 
{
    // Initialize stuff
    const startGame = props.startGame;
    const endGame = props.endGame;
    const nextGameVersion = props.nextGameVersion;
    const isHost = useSelector((state) => state.playerState.host);
    
  
    return (
      <div className="settingStuff">
        {isHost && <>
            <div>
                <button type="button" class="startGameButton" onClick={startGame}>Start Game</button>
            </div>
            <div>
                <button type="button" class="endGameButton" onClick={endGame}>End Game</button>
            </div>
            <div>
                <button type="button" class="endGameButton" onClick={nextGameVersion}>Next Game Version</button>
            </div>
        </>}
        {!isHost && <> 
            <div>
                <h2>Waiting for host to start the game</h2>
            </div>
        </>}
      </div>
    );
}


export default CoupContainer;