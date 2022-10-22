import { useState } from "react";
import { useSelector } from "react-redux";
import roles from "../../data/coup/roles";
import "../../styles/coup/CoupContainer.css"

// Coup container
function CoupContainer(props) 
{
  const numPlayers = useSelector((state) => state.lobbyState.playerList).length;
  const [socket, setSocket] = useState(props.socket);
  const lobbyState = useSelector((state) => state.lobbyState);
  const playerState = useSelector((state) => state.playerState);
  const gameVersion = lobbyState.coupGameState.gameVersion;
  const gameStarted = lobbyState.coupGameState.gameStarted;
  const gameEnded = lobbyState.coupGameState.gameEnded;
  const yourTurn = lobbyState.playerList[lobbyState.coupGameState.playerTurn].id === playerState.id;
  const minPlayers = 2;

  // Start game function
  function startGame() 
  {
    // If at least two players then start
    if (numPlayers >= minPlayers)
    {
      // Go through each player in player list and randomly assign two cards
      for (var i = 0; i < lobbyState.playerList.length; i++)
      {
        // Get length of current game version role list
        let roleListLength = roles[gameVersion].length;

        // Get two random ints from 0 to roleListLength
        let random1 = Math.floor(Math.random() * roleListLength);
        let random2 = Math.floor(Math.random() * roleListLength);

        // Get random role from role list and assign to player in game state
        lobbyState.playerList[i].card1 = roles[gameVersion][random1].name;
        lobbyState.playerList[i].card2 = roles[gameVersion][random2].name;
      }

      socket.emit("start_coup_game", lobbyState);
    }
    // Else display error message
    else
    {
      alert("Need at least two players to start game!");
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
  
  // View all player's num cards and num coins
  function viewStats()
  {
    // Create new player array of name, numCards, and numCoins
    var playerStatsArray = []
    for (var i = 0; i < lobbyState.playerList.length; i++)
    {
      // Don't include player self
      if (lobbyState.playerList[i].id != playerState.id)
      {
        var numCards = 0;
        if (lobbyState.playerList[i].card1 !== "dead")
        {
          numCards++;
        }
        if (lobbyState.playerList[i].card2 !== "dead")
        {
          numCards++;
        }
        playerStatsArray[i] = {name: lobbyState.playerList[i].nickname, cards: numCards, coins: lobbyState.playerList[i].numCoins}
      }
    }

    // Show to player
    alert(JSON.stringify(playerStatsArray));
  }

  // Play player's actual cards
  function playTruth()
  {
    alert("Playing truth");
  }

  // Let player pick a card from all roles to play
  function playLie()
  {
    alert("Playing lie");
  }

  // Let player draw a coin
  function playForeignAid()
  {
    alert("Playing foreign aid");
  }

  return (
    <>
    {!gameStarted && <>
        <div className="coupContainer">
            <div className="coupHeaderContent">
              <span>COUP</span>
            </div>
            <div class="parent">
              <RoleList roleList={roles} gameVersion={gameVersion}/>
              <SettingStuff startGame={startGame} nextGameVersion={nextGameVersion}/>
            </div>
      </div>
    </>}
    {gameStarted && <>
        <div className="coupContainer">
            {!yourTurn && <>
              <div className="coupHeaderContent">
                <span>{lobbyState.playerList[lobbyState.coupGameState.playerTurn].nickname}'s turn</span>
              </div>
            </>}
            {yourTurn && <>
              <div className="coupHeaderContent">
                <span>Your turn</span>
              </div>
            </>}
            <div class="coins">
              <h4>Coins: {playerState.numCoins}</h4>
            </div>
            <div class="parent">
              <div class="card">
                {playerState.card1}
              </div>
              <div class="card">
                {playerState.card2}
              </div>
            </div>
            {!yourTurn && <>
              <div class="turnStuff">
                <button type="button" class="startGameButton" onClick={viewStats}>View Player Stats</button>
              </div>
            </>}
            {yourTurn && <>
              <div class="turnStuff">
              <button type="button" class="startGameButton" onClick={playTruth}>Play Truth</button>
              <button type="button" class="startGameButton" onClick={playLie}>Play Lie</button>
              <button type="button" class="startGameButton" onClick={playForeignAid}>Play foreign aid</button>
              <button type="button" class="startGameButton" onClick={viewStats}>View Player Stats</button>
              </div>
            </>}
      </div>
    </>}
    </>
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