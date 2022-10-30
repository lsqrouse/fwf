import { useState } from "react";
import { useSelector } from "react-redux";
import roles from "../../data/coup/roles";
import "../../styles/coup/CoupContainer.css"

// Coup container
function CoupContainer(props) 
{
  // Initialize stuff
  const numPlayers = useSelector((state) => state.lobbyState.playerList).length;
  const [socket, setSocket] = useState(props.socket);
  const lobbyState = useSelector((state) => state.lobbyState);
  const playerState = useSelector((state) => state.playerState);
  const gameVersion = lobbyState.coupGameState.gameVersion;
  const gameStarted = lobbyState.coupGameState.gameStarted;
  const gameEnded = lobbyState.coupGameState.gameEnded;
  const isPlayerTurn = lobbyState.playerList[lobbyState.coupGameState.playerTurn].id === playerState.id;
  const minPlayers = 2;
  const canCoup = playerState.numCoins >= 7;
  const playerStatsArray = []
  const [playerSelectedCard, setPlayerSelectedCard] = useState(-1);
  
  // Create new player array of name, numCards, and numCoins
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
      playerStatsArray.push({name: lobbyState.playerList[i].nickname, cards: numCards, coins: lobbyState.playerList[i].numCoins});
    }
  }

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
        lobbyState.playerList[i].card1 = random1;
        lobbyState.playerList[i].card2 = random2;
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

  // Player confirms foreign aid
  function confirmForeignAid()
  {
    // Go through each player in player list
    for (var i = 0; i < lobbyState.playerList.length; i++)
    {
      // Get currernt player
      if (lobbyState.playerList[i].id == playerState.id)
      {
        // Update num coins
        lobbyState.playerList[i].numCoins += 1;
      }
    }
    socket.emit("player_confirm_foreign_aid", lobbyState);

    // Call next turn function
    nextTurn();

    // Close modal
    var modal = document.getElementById("playForeignAid");
    modal.style.display = "none";
  }

  function confirmSelectedCard()
  {
    // Call next turn function
    nextTurn();

    // Go through each player in player list and find curent player
    for (var i = 0; i < lobbyState.playerList.length; i++)
    {
      // If current player
      if (lobbyState.playerList[i].id == playerState.id)
      {
        // Update player num coins based on role chosen
        lobbyState.playerList[i].numCoins += roles[gameVersion][playerSelectedCard].coinAction;
      }
    }
  
    // Update coup game
    socket.emit("update_coup_game", lobbyState);

    // Close modal
    var modal = document.getElementById("playTruth");
    modal.style.display = "none";

    // Update variables
    setPlayerSelectedCard(-1);
  }

  // Go to next player turn
  function nextTurn()
  {
    socket.emit("next_player_turn", lobbyState);
  }
  
  // View all player's num cards and num coins
  function viewStats()
  {
    // Get the modal
    var modal = document.getElementById("playerStatsModal");

    // When the user clicks on the button, open the modal 
    modal.style.display = "block";

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) 
    {
      if (event.target == modal) {

        modal.style.display = "none";
      }
    }
  }

  // Play player's actual cards
  function playTruth()
  {
    // Get the modal
    var modal = document.getElementById("playTruth");

    // When the user clicks on the button, open the modal 
    modal.style.display = "block";

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) 
    {
      if (event.target == modal) 
      {
        modal.style.display = "none";
        setPlayerSelectedCard(-1);
      }
    }
  }

  // Play player's actual cards
  function playTruthCard1()
  {
    // Update player selected card
    setPlayerSelectedCard(playerState.card1);
  }

  // Play player's actual cards
  function playTruthCard2()
  {
    // Update player selected card
    setPlayerSelectedCard(playerState.card2);
  }

  // Let player pick a card from all roles to play
  function playLie()
  {
    // Get the modal
    var modal = document.getElementById("playLie");

    // When the user clicks on the button, open the modal 
    modal.style.display = "block";

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) 
    {
      if (event.target == modal) 
      {
        modal.style.display = "none";
        setPlayerSelectedCard(-1);
      }
    }
  }

  // Do user chosen lie role 
  function playLieRole()
  {
    alert("hey");
  }

  // Let player draw a coin
  function playForeignAid()
  {
    // Get the modal
    var modal = document.getElementById("playForeignAid");

    // When the user clicks on the button, open the modal 
    modal.style.display = "block";

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) 
    {
      if (event.target == modal) {

        modal.style.display = "none";
      }
    }
  }

  // Let player coup if have enough coins
  function playCoup()
  {
    // Get the modal
    var modal = document.getElementById("playCoup");

    // When the user clicks on the button, open the modal 
    modal.style.display = "block";

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) 
    {
      if (event.target == modal) {

        modal.style.display = "none";
      }
    }
  }

  return (
    <>
    {/* Game not started */}
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
    {/* Game started */}
    {gameStarted && <>
        <div className="coupContainer">
            {!isPlayerTurn && <>
              <div className="coupHeaderContent">
                <span>{lobbyState.playerList[lobbyState.coupGameState.playerTurn].nickname}'s turn</span>
              </div>
            </>}
            {isPlayerTurn && <>
              <div className="coupHeaderContent">
                <span>Your turn</span>
              </div>
            </>}
            <div class="coins">
              <h4>Coins: {playerState.numCoins}</h4>
            </div>
            <div class="parent">
              <div class="card">
                <h1>{roles[gameVersion][playerState.card1].name}</h1>
                <h3>{roles[gameVersion][playerState.card1].ability}</h3>
              </div>
              <div class="card">
                <h1>{roles[gameVersion][playerState.card2].name}</h1>
                <h3>{roles[gameVersion][playerState.card2].ability}</h3>
              </div>
            </div>
            {/* Pop up modals set to hidden by default */}
            <div id="playerStatsModal" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  <h1>Player Stats</h1>
                  <div class="carousel">
                    {Array.from(playerStatsArray, (player) => 
                    (<div class="item"> <h1>{player.name}</h1> <h3>cards: {player.cards}</h3> <h3>coins: {player.coins}</h3></div>)
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div id="playTruth" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  <h1>Playing Truth</h1>
                  <div class="parent">
                    <div class="card hoverMe" onClick={playTruthCard1}>
                      <h1>{roles[gameVersion][playerState.card1].name}</h1>
                      <h3>{roles[gameVersion][playerState.card1].ability}</h3>
                    </div>
                    <div class="card hoverMe" onClick={playTruthCard2}>
                      <h1>{roles[gameVersion][playerState.card2].name}</h1>
                      <h3>{roles[gameVersion][playerState.card2].ability}</h3>
                    </div>
                  </div>
                  {(playerSelectedCard >= 0) && <>
                      <div>
                        <h3>You have selected to play as the {roles[gameVersion][playerSelectedCard].name}</h3>
                        {roles[gameVersion][playerSelectedCard].pvp && <>
                          <h3>Choose target</h3>
                          <div class="carousel">
                            {Array.from(playerStatsArray, (player) => 
                            (<div class="item hoverMe"> <h1>{player.name}</h1> <h3>cards: {player.cards}</h3> <h3>coins: {player.coins}</h3></div>)
                            )}
                          </div>
                        </>}
                        {!roles[gameVersion][playerSelectedCard].pvp && <>
                          <button type="button" class="startGameButton" onClick={confirmSelectedCard}>Confirm</button>
                        </>}
                      </div>
                  </>}
                </div>
              </div>
            </div>
            <div id="playLie" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  <h1>Playing Lie</h1>
                  <div class="carousel">
                    {Array.from(roles[gameVersion], (role) => 
                    (<div class="item hoverMe"> <h2>{role.name}</h2></div>)
                    )}
                  </div>
                  {(playerSelectedCard >= 0) && <>
                      <div>
                        <h3>You have selected to play as the {roles[gameVersion][playerSelectedCard].name}</h3>
                        <button type="button" class="startGameButton" onClick={confirmSelectedCard}>Confirm</button>
                      </div>
                  </>}
                </div>
              </div>
            </div>
            <div id="playForeignAid" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  <h1>Playing Foreign Aid</h1>
                  <h3>Note. This action can be blocked by a Captain or Ambassador</h3>
                  <button type="button" class="startGameButton" onClick={confirmForeignAid}>Draw 1 Coin</button>
                </div>
              </div>
            </div>
            <div id="playCoup" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  {canCoup && <>
                    <h1>COUP who?</h1>
                    <div class="carousel">
                      {Array.from(playerStatsArray, (player) => 
                      (<div class="item hoverMe"> <h1>{player.name}</h1> <h3>cards: {player.cards}</h3> <h3>coins: {player.coins}</h3></div>)
                      )}
                    </div>
                  </>}
                  {!canCoup && <>
                    <h1>You need 7 coins to coup</h1>
                  </>}
                </div>
              </div>
            </div>

            {/* If not player turn only let them see stats */}
            {!isPlayerTurn && <>
              <div class="turnStuff">
                <button type="button" class="startGameButton" onClick={viewStats}>View Player Stats</button>
              </div>
            </>}
            {/* If player turn let them do turn stuff */}
            {isPlayerTurn && <>
              <div class="turnStuff">
              <button type="button" class="startGameButton" onClick={playTruth}>Play Truth</button>
              <button type="button" class="startGameButton" onClick={playLie}>Play Lie</button>
              <button type="button" class="startGameButton" onClick={playForeignAid}>Play foreign aid</button>
              <button type="button" class="startGameButton" onClick={playCoup}>COUP</button>
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
  
    return (
      <div className="roleList">
        {Array.from(roleList, (value) => (<span>{value.name} <br/> </span>))}
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