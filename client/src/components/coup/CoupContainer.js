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
  const stateOfGame = lobbyState.coupGameState.stateOfGame;
  const gameVersion = lobbyState.coupGameState.gameVersion;
  const isPlayerTurn = lobbyState.playerList[lobbyState.coupGameState.playerTurn].id === playerState.id;
  const minPlayers = 2;
  const canCoup = playerState.numCoins >= 7;
  const playerStatsArray = []
  const [playerSelectedCard, setPlayerSelectedCard] = useState(-1);
  const [playerSelectedCoup, setPlayerSelectedCoup] = useState(-1);
  const [playerSelectedTarget, setPlayerSelectedTarget] = useState(-1);
  const [goingToCounter, setGoingToCounter] = useState(-1);
  const [coupCardChosen, setCoupCardChosen] = useState(-1);
  const [bluffCardChosen, setBluffCardChosen] = useState(-1);
  const [assassinCardChosen, setAssassinCardChosen] = useState(-1);

  // Create new player array of name, numCards, and numCoins
  var counter = 0;
  for (var i = 0; i < lobbyState.playerList.length; i++)
  {
    // Don't include player self
    if (lobbyState.playerList[i].id != playerState.id)
    {
      // Put into player stats array
      playerStatsArray.push({id: lobbyState.playerList[i].id, index: counter, name: lobbyState.playerList[i].nickname, cards: lobbyState.playerList[i].numCards, coins: lobbyState.playerList[i].numCoins});

      // Update counter
      counter++;
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
        // Get two random ints from 0 to roleListLength
        let random1 = Math.floor(Math.random() * roles[gameVersion].length);
        let random2 = Math.floor(Math.random() * roles[gameVersion].length);

        // Get random role from role list and assign to player in game state
        lobbyState.playerList[i].card1 = random1;
        lobbyState.playerList[i].card1Alive = true;
        lobbyState.playerList[i].card2 = random2;
        lobbyState.playerList[i].card2Alive = true;
        lobbyState.playerList[i].numCoins = 3;
        lobbyState.playerList[i].isAlive = true;
        lobbyState.playerList[i].numCards = 2;
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
    // Go through each player in player list set their cards to 0
    for (var i = 0; i < lobbyState.playerList.length; i++)
    {
      lobbyState.playerList[i].card1 = 0;
      lobbyState.playerList[i].card2 = 0;
      lobbyState.playerList[i].numCards = 2;
    }
  
    // Update coup game
    socket.emit("update_coup_players", lobbyState);

    // End coup game
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
        lobbyState.playerList[i].numCoins += 2;
      }
    }

    // Uupdate player stats across all clients
    socket.emit("update_coup_players", lobbyState);

    // Let other players challenge this
    lobbyState.coupGameState.canCounter = true;
    lobbyState.coupGameState.didForeignAid = true;

    // Close modal
    var modal = document.getElementById("playForeignAid");
    modal.style.display = "none";

    // Call next turn function
    socket.emit("coup_next_player_turn", lobbyState);
  }

  // Player confirms income
  function confirmIncome()
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
    
    // Don't let other players challenge this
    lobbyState.coupGameState.canCounter = false;
    socket.emit("update_coup_players", lobbyState);

    // Close modal
    var modal = document.getElementById("playIncome");
    modal.style.display = "none";

    // Call next turn function
    socket.emit("coup_next_player_turn", lobbyState);
  }

  // Player confirms chosen card
  function confirmSelectedCard()
  {
    // Update game state if user played truth or lie
    if (playerSelectedCard != playerState.card1 && playerSelectedCard != playerState.card2)
    {
      lobbyState.coupGameState.lastTurnPlayerTrue = false;
    }
    else
    {
      lobbyState.coupGameState.lastTurnPlayerTrue = true;
    }

    // Go through each player in player list and find curent player
    for (var i = 0; i < lobbyState.playerList.length; i++)
    {
      // If current player
      if (lobbyState.playerList[i].id == playerState.id)
      {
        // Update player num coins based on role chosen
        lobbyState.playerList[i].numCoins += roles[gameVersion][playerSelectedCard].coinAction;

        // If player selected ambassador change cards
        if (roles[gameVersion][playerSelectedCard].name == "Ambassador")
        {
          // If card 1 is not couped
          if (lobbyState.playerList[i].card1 >= 0)
          {
            lobbyState.playerList[i].card1 = Math.floor(Math.random() * roles[gameVersion].length);
          }

          // If card 2 is not couped
          if (lobbyState.playerList[i].card2 >= 0)
          {
            lobbyState.playerList[i].card2 = Math.floor(Math.random() * roles[gameVersion].length);
          }
        }
      }
    }
  
    // Update coup game
    socket.emit("update_coup_players", lobbyState);

    // Close modal
    var modal1 = document.getElementById("playTruth");
    var modal2 = document.getElementById("playLie");
    modal1.style.display = "none";
    modal2.style.display = "none";

    // Update variables
    setPlayerSelectedCard(-1);

    // Update last turn player role index and let other players counter
    lobbyState.coupGameState.lastTurnPlayerRole = playerSelectedCard;
    lobbyState.coupGameState.didForeignAid = false;
    lobbyState.coupGameState.canCounter = true;

    // Call next turn function
    socket.emit("coup_next_player_turn", lobbyState);
  }

  // Close all modals that could be open
  socket.on("coup_close_all_modals", (data) => 
  {
    // Get the modals
    var modal = document.getElementById("coupPending");
    var modal1 = document.getElementById("previousTurnInfo");
    var modal2 = document.getElementById("bluffCalled");
    var modal3 = document.getElementById("playerStatsModal");
    var modal4 = document.getElementById("getChallenged");
    setGoingToCounter(-1);
    var modal5 = document.getElementById("previousBluffInfo");
    var modal6 = document.getElementById("previousCoupInfo");
    var modal7 = document.getElementById("assassinationPending");
    var modal8 = document.getElementById("captainPending");
    var modal9 = document.getElementById("challengePending");
    

    // Close the modals
    modal.style.display = "none";
    modal1.style.display = "none";
    modal2.style.display = "none";
    modal3.style.display = "none";
    modal4.style.display = "none";
    modal5.style.display = "none";
    modal6.style.display = "none";
    modal7.style.display = "none";
    modal8.style.display = "none";
    modal9.style.display = "none";
  });

  // If receiving previous player info from server open modal
  socket.on("open_prev_turn_modal", (data) => 
  {
    // Get the modal
    var modal = document.getElementById("previousTurnInfo");

    // When the user clicks on the button, open the modal 
    modal.style.display = "block";

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) 
    {
      if (event.target == modal) 
      {
        modal.style.display = "none";
        setGoingToCounter(-1);
      }
    }
  });

  // If player got couped open modal
  socket.on("open_coup_modal", (data) => 
  {
    // Get the modal
    var modal = document.getElementById("getCouped");

    // Open the modal
    modal.style.display = "block";
  });

  // Open coup pending modal for player that couped
  socket.on("open_coup_pending_modal", (data) => 
  {
    // Get the modal
    var modal = document.getElementById("coupPending");

    // Open the modal
    modal.style.display = "block";
  });

  // Close coup pending modal for player that couped
  socket.on("close_coup_pending_modal", (data) => 
  {
    // Get the modal
    var modal = document.getElementById("coupPending");

    // Close the modal
    modal.style.display = "none";
  });

  // If player got couped open modal for everyone else but the 2
  socket.on("open_coup_prev_turn_modal", (data) => 
  {
    // Get the modal
    var modal = document.getElementById("previousCoupInfo");

    // Close the modal
    modal.style.display = "block";

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) 
    {
      if (event.target == modal) 
      {
        modal.style.display = "none";
      }
    }
  });

  // If player's buff was called open modal
  socket.on("open_bluff_called_modal", (data) => 
  {
    // Get the modal
    var modal = document.getElementById("bluffCalled");

    // Open the modal
    modal.style.display = "block";
  });

  // If player's buff was called after challenge open modal
  socket.on("open_bluff_called_after_challenge_modal", (data) => 
  {
    // Get the modal
    var modal = document.getElementById("bluffCalledAfterChallenge");

    // Open the modal
    modal.style.display = "block";
  });

  // Open bluff pending modal for player that couped
  socket.on("open_bluff_pending_modal", (data) => 
  {
    // Get the modal
    var modal = document.getElementById("bluffPending");

    // Open the modal
    modal.style.display = "block";
  });

  // Close coup pending modal for player that couped
  socket.on("close_bluff_pending_modal", (data) => 
  {
    // Get the modal
    var modal = document.getElementById("bluffPending");

    // Close the modal
    modal.style.display = "none";
  });

  // Show results of bluff call to everyone else
  socket.on("open_bluff_prev_turn_modal", (data) => 
  {
    // Get the modal
    var modal = document.getElementById("previousBluffInfo");

    // Close the modal
    modal.style.display = "block";

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) 
    {
      if (event.target == modal) 
      {
        modal.style.display = "none";
      }
    }
  });

  // Show results of bluff call to everyone else
  socket.on("close_bluff_prev_turn_modal", (data) => 
  {
    // Get the modal
    var modal = document.getElementById("previousBluffInfo");

    // Close the modal
    modal.style.display = "none";
  });

  // If player was targeted open their target modal
  socket.on("open_player_targeted_modal", (data) => 
  {
    // Get the modal
    var modal = document.getElementById("playerTargeted");

    // Open the modal
    modal.style.display = "block";

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) 
    {
      if (event.target == modal) 
      {
        modal.style.display = "none";
        setGoingToCounter(-1);

        // If last played card was assassin then open get assassinated modal
        if (roles[gameVersion][lobbyState.coupGameState.lastTurnPlayerRole].name == "Assassin")
        {
          var modal1 = document.getElementById("getAssassinated");
          modal1.style.display = "block";
        }

        // Close pending modals
        socket.emit("coup_close_all_client_modals", lobbyState);
      }
    }
  });

  // Open assassin pending modal for all other players
  socket.on("open_assassin_pending_modal", (data) => 
  {
    // Get the modal
    var modal = document.getElementById("assassinationPending");

    // Open the modal
    modal.style.display = "block";
  });

  // Open ambassador pending modal for all other players
  socket.on("open_captain_pending_modal", (data) => 
  {
    // Get the modal
    var modal = document.getElementById("captainPending");

    // Open the modal
    modal.style.display = "block";
  });
  
  // Open challenge pending modal for all other players
  socket.on("open_challenge_pending_modal", (data) => 
  {
    // Get the modal
    var modal = document.getElementById("challengePending");

    // Open the modal
    modal.style.display = "block";
  });

  // Open challenge pending modal for player that was challenged
  socket.on("open_get_challenged_modal", (data) => 
  {
    // Get the modal
    var modal = document.getElementById("getChallenged");

    // Open the modal
    modal.style.display = "block";

    // When the user clicks anywhere outside of the modal, close it and all other client modals so game goes on
    window.onclick = function(event) 
    {
      if (event.target == modal) 
      {
        modal.style.display = "none";

        // Close all other client modals
        socket.emit("coup_close_all_client_modals", lobbyState);

        // Go through each player in player list and find curent player
        for (var i = 0; i < lobbyState.playerList.length; i++)
        {
          // If current player
          if (lobbyState.playerList[i].id == playerState.id)
          {
            // If player tried foreign aid
            if (lobbyState.coupGameState.didForeignAid)
            {
              // Undo foreign aid
              lobbyState.playerList[i].numCoins -= 2;
            }
            // Else if player tried captain
            else if (lobbyState.coupGameState.lastTurnPlayerRole == 1)
            {
              lobbyState.playerList[i].numCoins -= lobbyState.coupGameState.coinsTakenDuringCaptain;
            }
          }
          // Else if targeted player
          if (lobbyState.playerList[i].id == lobbyState.coupGameState.playerTargetedId)
          {
            // If player tried captain
            if (lobbyState.coupGameState.lastTurnPlayerRole == 1)
            {
              lobbyState.playerList[i].numCoins += lobbyState.coupGameState.coinsTakenDuringCaptain;
            }
          }
        }
      
        // Update coup players
        socket.emit("update_coup_players", lobbyState);
      }
    }
  });

  // Player challenges previous turn action
  function challengeCard()
  {
    // Update going to counter var
    setGoingToCounter(0);
  }

  // Player calls bs on previous turn action
  function callingBs()
  {
    // Update going to counter var
    setGoingToCounter(1);
  }

  // Player confirms challenge foreign aid
  function confirmChallengeAsDuke()
  {
    // Update game state if user played truth or lie
    if ((playerState.card1 != 0 || playerState.card1Alive == false) && (playerState.card2 != 0 || playerState.card2Alive == false))
    {
      lobbyState.coupGameState.challengePlayerTrue = false;
    }
    else
    {
      lobbyState.coupGameState.challengePlayerTrue = true;
    }

    // Close modal and reset going to counter var
    var modal = document.getElementById("previousTurnInfo");
    modal.style.display = "none";
    setGoingToCounter(-1);

    // Update player that challenged
    lobbyState.coupGameState.playerChallengedId = playerState.id;
    lobbyState.coupGameState.playerChallengedWith = "Duke"

    // Tell server that player is challenging foreign aid
    socket.emit("coup_challenging_foreign_aid", lobbyState);
  }

  // Player confirms challenge foreign aid
  function confirmChallengeAsAmbassador()
  {
    // Update game state if user played truth or lie
    if ((playerState.card1 != 4 || playerState.card1Alive == false) && (playerState.card2 != 4 || playerState.card2Alive == false))
    {
      lobbyState.coupGameState.challengePlayerTrue = false;
    }
    else
    {
      lobbyState.coupGameState.challengePlayerTrue = true;
    }

    // Close modal and reset going to counter var
    var modal = document.getElementById("playerTargeted");
    modal.style.display = "none";
    setGoingToCounter(-1);

    // Update player that challenged
    lobbyState.coupGameState.playerChallengedId = playerState.id;
    lobbyState.coupGameState.playerChallengedWith = "Ambassador"

    // Tell server that player is challenging foreign aid
    socket.emit("coup_challenging_captain", lobbyState);
  }

  // Player confirms challenge foreign aid
  function confirmChallengeAsCaptain()
  {
    // Update game state if user played truth or lie
    if ((playerState.card1 != 1 || playerState.card1Alive == false) && (playerState.card2 != 1 || playerState.card2Alive == false))
    {
      lobbyState.coupGameState.challengePlayerTrue = false;
    }
    else
    {
      lobbyState.coupGameState.challengePlayerTrue = true;
    }

    // Close modal and reset going to counter var
    var modal = document.getElementById("playerTargeted");
    modal.style.display = "none";
    setGoingToCounter(-1);

    // Update player that challenged
    lobbyState.coupGameState.playerChallengedId = playerState.id;
    lobbyState.coupGameState.playerChallengedWith = "Captain"

    // Tell server that player is challenging foreign aid
    socket.emit("coup_challenging_captain", lobbyState);
  }

  // Player confirms challenge assassination
  function confirmChallengeAsContessa()
  {
    // Update game state if user played truth or lie
    if ((playerState.card1 != 2 || playerState.card1Alive == false) && (playerState.card2 != 2 || playerState.card2Alive == false))
    {
      lobbyState.coupGameState.challengePlayerTrue = false;
    }
    else
    {
      lobbyState.coupGameState.challengePlayerTrue = true;
    }

    // Close modal and reset going to counter var
    var modal = document.getElementById("playerTargeted");
    modal.style.display = "none";
    setGoingToCounter(-1);

    // Update player that challenged
    lobbyState.coupGameState.playerChallengedId = playerState.id;
    lobbyState.coupGameState.playerChallengedWith = "Contessa"

    // Tell server that player is challenging foreign aid
    socket.emit("coup_challenging_assassination", lobbyState);
  }

  function confirmBS()
  {
    // Update lobbystate that player called bs
    lobbyState.coupGameState.playerCalledBsId = playerState.id;

    // Update game state that player called bs
    socket.emit("coup_player_called_bs", lobbyState);

    // Close modals and reset going to counter var
    var modal = document.getElementById("previousTurnInfo");
    var modal1 = document.getElementById("playerTargeted");
    modal.style.display = "none";
    modal1.style.display = "none";
    setGoingToCounter(-1);
  }

  function confirmBSAfterChallenge()
  {
    // Update lobbystate that player called bs
    lobbyState.coupGameState.playerCalledBsId = playerState.id;

    // Update game state that player called bs
    socket.emit("coup_player_called_bs_after_challenge", lobbyState);

    // Close modals and reset going to counter var
    var modal = document.getElementById("getChallenged");
    modal.style.display = "none";
    setGoingToCounter(-1);
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
        setPlayerSelectedTarget(-1);
      }
    }
  }

  // Play player's actual cards
  function playTruthCard1()
  {
    // Update player selected card
    setPlayerSelectedCard(playerState.card1);
    setPlayerSelectedTarget(-1);
  }

  // Play player's actual cards
  function playTruthCard2()
  {
    // Update player selected card
    setPlayerSelectedCard(playerState.card2);
    setPlayerSelectedTarget(-1);
  }

  // Player chooses card 1 to get couped
  function playCoupCard1()
  {
    // Update player selected card
    setCoupCardChosen(0);
  }

  // Player chooses card 2 to get couped
  function playCoupCard2()
  {
    // Update player selected card
    setCoupCardChosen(1);
  }

  // Player confirms selected card to get couped  
  function confirmSelectedCardCoup()
  {
    // Go through each player in player list and find curent player
    for (var i = 0; i < lobbyState.playerList.length; i++)
    {
      // If current player
      if (lobbyState.playerList[i].id == playerState.id)
      {
        // If player selected card 1 for coup
        if (coupCardChosen == 0)
        {
          // Update coup card chosen
          lobbyState.playerList[i].card1Alive = false;
        }
        else
        {
          lobbyState.playerList[i].card2Alive = false; 
        }

        // Update player state overall num cards
        lobbyState.playerList[i].numCards -= 1;
      }
    }
  
    // Update coup players
    socket.emit("update_coup_players", lobbyState);

    // Get and close the modal
    var modal = document.getElementById("getCouped");
    modal.style.display = "none";

    // Update game state that coup thing is over
    socket.emit("coup_turn_just_finished", lobbyState);

    // Reset coup card chosen variable
    setCoupCardChosen(-1);
  }

  // Player confirms they were eliminated
  function confirmPlayerEliminated()
  {
    // Go through each player in player list and find curent player
    for (var i = 0; i < lobbyState.playerList.length; i++)
    {
      // If current player
      if (lobbyState.playerList[i].id == playerState.id)
      {
        // Update coup cards and is alive variable
        lobbyState.playerList[i].isAlive = false;
        lobbyState.playerList[i].card1Alive = false;
        lobbyState.playerList[i].card2Alive = false;

        // Update player state overall num cards
        lobbyState.playerList[i].numCards = 0;

        // Go to next player if player has turn
        if (lobbyState.playerList[lobbyState.coupGameState.playerTurn].id == playerState.id)
        {
          socket.emit("coup_just_increment_turn", lobbyState);
        }
      }
    }
    
    // Update coup players
    socket.emit("update_coup_players", lobbyState);

    // Get the modal and close it
    var modal = document.getElementById("getCouped");
    modal.style.display = "none";

    // Close all modals in clients
    socket.emit("coup_close_all_client_modals", lobbyState);

    // Update game state that coup turn is over
    socket.emit("coup_just_increment_turn", lobbyState);
  }

  // Player confirms they were eliminated
  function assassinConfirmPlayerEliminated()
  {
    // Close get assasssinated modal
    var modal = document.getElementById("getAssassinated");
    modal.style.display = "none";

    // Go through each player in player list and find curent player
    for (var i = 0; i < lobbyState.playerList.length; i++)
    {
      // If current player
      if (lobbyState.playerList[i].id == playerState.id)
      {
        // Update coup cards and is alive variable
        lobbyState.playerList[i].isAlive = false;
        lobbyState.playerList[i].card1Alive = false;
        lobbyState.playerList[i].card2Alive = false;

        // Update player state overall num cards
        lobbyState.playerList[i].numCards = 0;

        // Go to next player if player has turn
        if (lobbyState.playerList[lobbyState.coupGameState.playerTurn].id == playerState.id)
        {
          socket.emit("coup_just_increment_turn", lobbyState);
        }
      }
    }
    
    // Update coup players
    socket.emit("update_coup_players", lobbyState);

    // Get the modal and close it
    var modal = document.getElementById("getCouped");
    modal.style.display = "none";

    // Close all modals in clients
    socket.emit("coup_close_all_client_modals", lobbyState);
  }

  // Player chooses card 1 for bluff
  function playBluffCard1()
  {
    // Update player selected card
    setBluffCardChosen(0);
  }

  // Player chooses card 2 for bluff
  function playBluffCard2()
  {
    // Update player selected card
    setBluffCardChosen(1);
  }

  // Player confirms selected card for bluff 
  function confirmSelectedBluffCard()
  {
    // Go through each player in player list and find curent player
    for (var i = 0; i < lobbyState.playerList.length; i++)
    {
      // If current player
      if (lobbyState.playerList[i].id == playerState.id)
      {
        // If previous player was bluffing
        if (lobbyState.coupGameState.lastTurnPlayerTrue == false)
        {
          // If card coin action was positive then undo it
          if (roles[gameVersion][lobbyState.coupGameState.lastTurnPlayerRole].coinAction > 0)
          {
            lobbyState.playerList[i].numCoins -= roles[gameVersion][lobbyState.coupGameState.lastTurnPlayerRole].coinAction;
          }
        }

        // If player selected card 1 for bluff
        if (bluffCardChosen == 0)
        {
          lobbyState.playerList[i].card1Alive = false;
        }
        else
        {
          lobbyState.playerList[i].card2Alive = false; 
        }

        // Update player state overall num cards
        lobbyState.playerList[i].numCards -= 1;
      }
    }
  
    // Update coup players
    socket.emit("update_coup_players", lobbyState);

    // Get and close the modal
    var modal = document.getElementById("bluffCalled");
    modal.style.display = "none";

    // Update game state that coup thing is over
    socket.emit("bluff_turn_just_finished", lobbyState);

    // Reset coup card chosen variable
    setBluffCardChosen(-1);
  }

  // Player confirms selected card for bluff 
  function confirmSelectedBluffCardAfterChallenge()
  {
    // Go through each player in player list and find curent player
    for (var i = 0; i < lobbyState.playerList.length; i++)
    {
      // If current player
      if (lobbyState.playerList[i].id == playerState.id)
      {
        // If previous player was bluffing
        if (lobbyState.coupGameState.challengePlayerTrue == false)
        {
          lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].numCoins += 2;
        }

        // If player selected card 1 for bluff
        if (bluffCardChosen == 0)
        {
          lobbyState.playerList[i].card1Alive = false;
        }
        else
        {
          lobbyState.playerList[i].card2Alive = false; 
        }

        // Update player state overall num cards
        lobbyState.playerList[i].numCards -= 1;
      }
    }
  
    // Update coup players
    socket.emit("update_coup_players", lobbyState);

    // Get and close the modal
    var modal = document.getElementById("bluffCalledAfterChallenge");
    modal.style.display = "none";

    // Update game state that coup thing is over
    socket.emit("bluff_turn_after_challenge_just_finished", lobbyState);

    // Reset coup card chosen variable
    setBluffCardChosen(-1);
  }

  // Player confirms they were eliminated
  function bluffConfirmPlayerEliminated()
  {
    // Go through each player in player list and find curent player
    for (var i = 0; i < lobbyState.playerList.length; i++)
    {
      // If current player
      if (lobbyState.playerList[i].id == playerState.id)
      {
        // Update coup cards and is alive variable
        lobbyState.playerList[i].isAlive = false;
        lobbyState.playerList[i].card1Alive = false;
        lobbyState.playerList[i].card2Alive = false;

        // Update player state overall num cards
        lobbyState.playerList[i].numCards = 0;

        // Go to next player if player has turn
        if (lobbyState.playerList[lobbyState.coupGameState.playerTurn].id == playerState.id)
        {
          socket.emit("coup_just_increment_turn", lobbyState);
        }
      }
    }
    
    // Update coup players
    socket.emit("update_coup_players", lobbyState);

    // Get the modal and close it
    var modal = document.getElementById("bluffCalled");
    modal.style.display = "none";

    // Close all modals in clients
    socket.emit("coup_close_all_client_modals", lobbyState);

    // Update game state that coup turn is over
    socket.emit("bluff_turn_just_finished", lobbyState);
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
        setPlayerSelectedTarget(-1);
      }
    }
  }

  // Do user chosen lie role 
  function playLieRole(cardSelected)
  {
    // Update player selected card
    setPlayerSelectedCard(cardSelected);
    setPlayerSelectedTarget(-1);
  }

  // Let player do foreign aid
  function playForeignAid()
  {
    // Get the modal
    var modal = document.getElementById("playForeignAid");

    // When the user clicks on the button, open the modal 
    modal.style.display = "block";

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) 
    {
      if (event.target == modal) 
      {
        modal.style.display = "none";
      }
    }
  }

  // Let player draw a coin
  function playIncome()
  {
    // Get the modal
    var modal = document.getElementById("playIncome");

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
      if (event.target == modal) 
      {
        modal.style.display = "none";
        setPlayerSelectedCoup(-1);
      }
    }
  }

  // When player chooses player to coup
  function choosePlayerCoup(playerIndex)
  {
    // Update player selected coup variable
    setPlayerSelectedCoup(playerIndex);
  }

  // User confirms player to coup
  function confirmSelectedCoup()
  {
    // Go through each player in player list
    for (var i = 0; i < lobbyState.playerList.length; i++)
    {
      // Get currernt player
      if (lobbyState.playerList[i].id == playerState.id)
      {
        // Update num coins
        lobbyState.playerList[i].numCoins -= 7;
      }
    }
    
    // Update players
    socket.emit("update_coup_players", lobbyState);

    // Update lobby state coup target and couped boolean
    lobbyState.coupGameState.couped = true;
    lobbyState.coupGameState.coupTargetId = playerStatsArray[playerSelectedCoup].id;
    lobbyState.coupGameState.coupTarget = playerStatsArray[playerSelectedCoup].index;

    // Get the modal
    var modal = document.getElementById("playCoup");

    // Close the modal
    modal.style.display = "none";
    setPlayerSelectedCoup(-1);

    // Call next turn function
    socket.emit("coup_next_player_turn", lobbyState);
  }

  // When player chooses player to target
  function choosePlayerTarget(playerIndex)
  {
    // Update player selected coup variable
    setPlayerSelectedTarget(playerIndex);
  }

  // User confirms player to target
  function confirmSelectedCardAndTarget()
  {
    // Update game state if user played truth or lie
    if (playerSelectedCard != playerState.card1 && playerSelectedCard != playerState.card2)
    {
      lobbyState.coupGameState.lastTurnPlayerTrue = false;
    }
    else
    {
      lobbyState.coupGameState.lastTurnPlayerTrue = true;
    }

    // Go through each player in player list
    var curentPlayerI = 0;
    for (var i = 0; i < lobbyState.playerList.length; i++)
    {
      // If current player
      if (lobbyState.playerList[i].id == playerState.id)
      {
        // Update player num coins based on role chosen
        lobbyState.playerList[i].numCoins += roles[gameVersion][playerSelectedCard].coinAction;
        curentPlayerI = i;
      }
      // Else if targeted player and role action is positive
      else if (lobbyState.playerList[i].id == playerStatsArray[playerSelectedTarget].id)
      {
        // If last player selected role card coin action was positive subtract from target
        if (roles[gameVersion][playerSelectedCard].coinAction > 0)
        {
          // If their coins will be negative then adjust current player's coins accordingly
          if (lobbyState.playerList[i].numCoins - roles[gameVersion][playerSelectedCard].coinAction < 0)
          {
            lobbyState.playerList[curentPlayerI].numCoins -= roles[gameVersion][playerSelectedCard].coinAction;
            lobbyState.playerList[curentPlayerI].numCoins += lobbyState.playerList[i].numCoins;
            lobbyState.coupGameState.coinsTakenDuringCaptain = lobbyState.playerList[i].numCoins;
            lobbyState.playerList[i].numCoins = 0;
          }
          // Else just take their coins
          else
          {
            lobbyState.playerList[i].numCoins -= roles[gameVersion][playerSelectedCard].coinAction;
            lobbyState.coupGameState.coinsTakenDuringCaptain = 2;
          }
        }

        // Update player target in game state
        lobbyState.coupGameState.playerTargeted = i;
        lobbyState.coupGameState.playerTargetedId = lobbyState.playerList[i].id;
      }
    }
  
    // Update coup game
    socket.emit("update_coup_players", lobbyState);

    // Close modal
    var modal1 = document.getElementById("playTruth");
    var modal2 = document.getElementById("playLie");
    modal1.style.display = "none";
    modal2.style.display = "none";

    // Update variables
    setPlayerSelectedCard(-1);

    // Update last turn player role index and let other players counter
    lobbyState.coupGameState.lastTurnPlayerRole = playerSelectedCard;
    lobbyState.coupGameState.didForeignAid = false;
    lobbyState.coupGameState.canCounter = true;

    // Call next turn function
    socket.emit("coup_next_player_and_target_turn", lobbyState);
  }

  // Player chooses card 1 to get assassinated
  function playAssassinCard1()
  {
    // Update player selected card
    setAssassinCardChosen(0);
  }

  // Player chooses card 2 to get assassinated
  function playAssassinCard2()
  {
    // Update player selected card
    setAssassinCardChosen(1);
  }

  // Player confirms selected card to get assassinated  
  function confirmSelectedCardAssassin()
  {
    // Go through each player in player list and find curent player
    for (var i = 0; i < lobbyState.playerList.length; i++)
    {
      // If current player
      if (lobbyState.playerList[i].id == playerState.id)
      {
        // If player selected card 1 for coup
        if (assassinCardChosen == 0)
        {
          // Update coup card chosen
          lobbyState.playerList[i].card1Alive = false;
        }
        else
        {
          lobbyState.playerList[i].card2Alive = false; 
        }

        // Update player state overall num cards
        lobbyState.playerList[i].numCards -= 1;
      }
    }
  
    // Update coup players
    socket.emit("update_coup_players", lobbyState);

    // Get and close the modal
    var modal = document.getElementById("getAssassinated");
    modal.style.display = "none";

    // Reset coup card chosen variable
    setAssassinCardChosen(-1);

    // Close all modals in clients
    socket.emit("coup_close_all_client_modals", lobbyState);
  }

  return (
    <>
    {/* Game not started */}
    {(stateOfGame == 0) && <>
        <div className="coupContainer">
            <div className="coupHeaderContent">
              <span>COUP</span>
            </div>
            <div class="parent">
              <RoleList roleList={roles} gameVersion={gameVersion}/>
              <SettingStuff startGame={startGame} nextGameVersion={nextGameVersion} lobbyState={lobbyState}/>
            </div>
      </div>
    </>}

    {/* Game started and finished*/}
    {(stateOfGame == 2) && <>
      <div className="coupContainer">
        <div className="coupHeaderContent">
          <span>Game Over</span>
          <h3>{lobbyState.coupGameState.playerWon} won the game!</h3>
        </div>
        {playerState.host && <>
          <div class="centerStuff">
            <button type="button" class="startGameButton" onClick={endGame}>End Game</button>
          </div>
        </>}
      </div>
    </>}

    {/* Game only started */}
    {(stateOfGame == 1) && <>
        <div className="coupContainer">
            <div className="coupHeaderContent">
              <span>Coins: {playerState.numCoins}</span>
            </div>
            <div class="parent">
              <div class="card">
                {playerState.card1Alive && <>
                  <h1>{roles[gameVersion][playerState.card1].name}</h1>
                  <h3>{roles[gameVersion][playerState.card1].ability}</h3>
                </>}
                {!playerState.card1Alive && <>
                  <h1>None</h1>
                  <h3>This card was couped</h3>
                </>}
              </div>
              <div class="card">
                {playerState.card2Alive && <>
                  <h1>{roles[gameVersion][playerState.card2].name}</h1>
                  <h3>{roles[gameVersion][playerState.card2].ability}</h3>
                </>}
                {!playerState.card2Alive && <>
                  <h1>None</h1>
                  <h3>This card was couped</h3>
                </>}
              </div>
            </div>

            {/* Pop up modals set to hidden by default */}
            <div id="playerStatsModal" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  <h1>Player Stats</h1>
                  <div class="carousel">
                    {playerStatsArray.map((player) => 
                    {
                      if (player.cards > 0) 
                      {
                        return (<div class="item"> <h1>{player.name}</h1> <h3>cards: {player.cards}</h3> <h3>coins: {player.coins}</h3></div>);
                      }
                      return (<div class="item"> <h1>{player.name}</h1> <h3>is</h3> <h3>dead</h3></div>);
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div id="playTruth" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  <h1>Playing Truth</h1>
                  <div class="parent">
                    {playerState.card1Alive && <>
                      <div class="card hoverMe" onClick={playTruthCard1}>
                        <h1>{roles[gameVersion][playerState.card1].name}</h1>
                        <h3>{roles[gameVersion][playerState.card1].ability}</h3>
                      </div>
                    </>}
                    {!playerState.card1Alive && <>
                      <div class="card">
                        <h1>None</h1>
                        <h3>This card was couped</h3>
                      </div>
                    </>}
                    {playerState.card2Alive && <>
                      <div class="card hoverMe" onClick={playTruthCard2}>
                        <h1>{roles[gameVersion][playerState.card2].name}</h1>
                        <h3>{roles[gameVersion][playerState.card2].ability}</h3>
                      </div>
                    </>}
                    {!playerState.card2Alive && <>
                      <div class="card">
                        <h1>None</h1>
                        <h3>This card was couped</h3>
                      </div>
                    </>}
                  </div>
                  {(playerSelectedCard >= 0) && <>
                      {roles[gameVersion][playerSelectedCard].canBePlayed && <>
                        <div>
                          <h3>You have selected to play as the {roles[gameVersion][playerSelectedCard].name}</h3>
                          {roles[gameVersion][playerSelectedCard].pvp && <>
                            {(playerState.numCoins + roles[gameVersion][playerSelectedCard].coinAction >= 0) && <>
                              <h3>Choose target</h3>
                              <div class="carousel">
                                {playerStatsArray.map((player) => 
                                {
                                  if (player.cards > 0) 
                                  {
                                    return (<div class="item hoverMe" onClick={() => choosePlayerTarget(player.index)}> <h1>{player.name}</h1> <h3>cards: {player.cards}</h3> <h3>coins: {player.coins}</h3></div>);
                                  }
                                  return;
                                })}
                              </div>
                            </>}
                            {!(playerState.numCoins + roles[gameVersion][playerSelectedCard].coinAction >= 0) && <>
                              <h3>You don't have enough coins</h3>
                            </>}
                            {(playerSelectedTarget >= 0) && <>
                                <h3>Target {playerStatsArray[playerSelectedTarget].name}?</h3>
                                <button type="button" class="startGameButton" onClick={confirmSelectedCardAndTarget}>Confirm</button>
                            </>}
                          </>}
                          {!roles[gameVersion][playerSelectedCard].pvp && <>
                            <button type="button" class="startGameButton" onClick={confirmSelectedCard}>Confirm</button>
                          </>}
                        </div>
                      </>}
                      {!roles[gameVersion][playerSelectedCard].canBePlayed && <>
                        <h3>{roles[gameVersion][playerSelectedCard].name} can only {roles[gameVersion][playerSelectedCard].ability}</h3>
                      </>}
                  </>}
                </div>
              </div>
            </div>
            <div id="playLie" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  <h1>Playing Lie</h1>
                  <div class="carousel">
                      {roles[gameVersion].map((role) => 
                      {
                        if (!((role.id == playerState.card1 && playerState.card1Alive) || (role.id == playerState.card2 && playerState.card2Alive)) && (role.canBePlayed == true)) 
                        {
                          return (<div class="item hoverMe" onClick={() => playLieRole(role.id)}> <h2>{role.name}</h2></div>);
                        }
                        return null;
                      })}
                  </div>
                  {(playerSelectedCard >= 0) && <>
                      <div>
                        <h3>{roles[gameVersion][playerSelectedCard].name}: {roles[gameVersion][playerSelectedCard].ability}</h3>
                        {roles[gameVersion][playerSelectedCard].pvp && <>
                          {(playerState.numCoins + roles[gameVersion][playerSelectedCard].coinAction >= 0) && <>
                              <h3>Choose target</h3>
                              <div class="carousel">
                                {playerStatsArray.map((player) => 
                                {
                                  if (player.cards > 0) 
                                  {
                                    return (<div class="item hoverMe" onClick={() => choosePlayerTarget(player.index)}> <h1>{player.name}</h1> <h3>cards: {player.cards}</h3> <h3>coins: {player.coins}</h3></div>);
                                  }
                                  return;
                                })}
                              </div>
                            </>}
                            {!(playerState.numCoins + roles[gameVersion][playerSelectedCard].coinAction >= 0) && <>
                              <h3>You don't have enough coins</h3>
                            </>}
                          {(playerSelectedTarget >= 0) && <>
                              <h3>Target {playerStatsArray[playerSelectedTarget].name}?</h3>
                              <button type="button" class="startGameButton" onClick={confirmSelectedCardAndTarget}>Confirm</button>
                          </>}
                        </>}
                        {!roles[gameVersion][playerSelectedCard].pvp && <>
                          <button type="button" class="startGameButton" onClick={confirmSelectedCard}>Confirm</button>
                        </>}
                      </div>
                  </>}
                </div>
              </div>
            </div>
            <div id="playForeignAid" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  <h1>Playing Foreign Aid</h1>
                  <h3>Take 2 coins.</h3>
                  <h3>Note: This action can be blocked by a Duke</h3>
                  <button type="button" class="startGameButton" onClick={confirmForeignAid}>Draw 2 Coins</button>
                </div>
              </div>
            </div>
            <div id="playIncome" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  <h1>Playing Income</h1>
                  <h3>Take 1 coin.</h3>
                  <h3>Note: This can't be blocked or challenged.</h3>
                  <button type="button" class="startGameButton" onClick={confirmIncome}>Draw 1 Coin</button>
                </div>
              </div>
            </div>
            <div id="previousTurnInfo" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  {(lobbyState.coupGameState.canCounter && lobbyState.coupGameState.didForeignAid) && <>
                    <h1>{lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].nickname} played foreign aid.</h1>
                    <h3>{lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].nickname} has {lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].numCoins} coins {lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].numCards} cards</h3>
                    {playerState.isAlive && <>
                      <div class="soloCard hoverMe" onClick={challengeCard}>
                        <h1>Challenge</h1>
                        <h3>With a duke</h3>
                      </div>
                    </>}
                  </>}
                  {(lobbyState.coupGameState.canCounter && !lobbyState.coupGameState.didForeignAid) && <>
                    <h1>{lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].nickname} played {roles[gameVersion][lobbyState.coupGameState.lastTurnPlayerRole].name}</h1>
                    <h3>{lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].nickname} has {lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].numCoins} coins {lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].numCards} cards</h3>
                    {roles[gameVersion][lobbyState.coupGameState.lastTurnPlayerRole].pvp && <>
                      {playerState.isAlive && <>
                        <div class="parent">
                          <div class="card hoverMe" onClick={callingBs}>
                            <h1>Call BS</h1>
                            <h3>Liar liar pants on fire</h3>
                          </div>
                          <div class="card hoverMe">
                            <h1>Challenge</h1>
                            <h3>I challenge you to a duel</h3>
                          </div>
                        </div>
                      </>}
                    </>}
                    {!roles[gameVersion][lobbyState.coupGameState.lastTurnPlayerRole].pvp && <>
                      {playerState.isAlive && <>
                        <div class="soloCard hoverMe" onClick={callingBs}>
                          <h1>Call BS</h1>
                          <h3>Liar liar pants on fire</h3>
                        </div>
                      </>}
                    </>}
                  </>}
                  {!lobbyState.coupGameState.canCounter && <>
                    <h1>{lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].nickname} played income</h1>
                    <h3>{lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].nickname} has {lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].numCoins} coins {lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].numCards} cards</h3>
                    <h3>Nothing to counter.</h3>
                  </>}
                  {(goingToCounter == 0) && <>
                    <h3>Confirm Challenge</h3>
                    <button type="button" class="startGameButton" onClick={confirmChallengeAsDuke}>Confirm</button>
                  </>}
                  {(goingToCounter == 1) && <>
                    <h3>Confirm BS</h3>
                    <button type="button" class="startGameButton" onClick={confirmBS}>Confirm</button>
                  </>}
                </div>
              </div>
            </div>
            <div id="playCoup" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  {canCoup && <>
                    <h1>COUP who?</h1>
                    <h3>This costs 7 coins</h3>
                    <div class="carousel">
                      {playerStatsArray.map((player) => 
                      {
                        if (player.cards > 0) 
                        {
                          return (<div class="item hoverMe" onClick={() => choosePlayerCoup(player.index)}> <h1>{player.name}</h1> <h3>cards: {player.cards}</h3> <h3>coins: {player.coins}</h3></div>);
                        }
                        return;
                      })}
                    </div>
                    {(playerSelectedCoup >= 0) && <>
                      <h3>Coup {playerStatsArray[playerSelectedCoup].name}?</h3>
                      <button type="button" class="startGameButton" onClick={confirmSelectedCoup}>Confirm</button>
                    </>}
                  </>}
                  {!canCoup && <>
                    <h1>You need 7 coins to coup</h1>
                  </>}
                </div>
              </div>
            </div>
            <div id="getCouped" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  <h1>{lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].nickname} couped you</h1>
                  {(playerState.numCards == 2) && <>
                    <h3>Choose card to give up</h3>
                    <div class="parent">
                      <div class="card hoverMe" onClick={playCoupCard1}>
                        <h1>{roles[gameVersion][playerState.card1].name}</h1>
                        <h3>{roles[gameVersion][playerState.card1].ability}</h3>
                      </div>
                      <div class="card hoverMe" onClick={playCoupCard2}>
                        <h1>{roles[gameVersion][playerState.card2].name}</h1>
                        <h3>{roles[gameVersion][playerState.card2].ability}</h3>
                      </div>
                    </div>
                  </>}
                  {(coupCardChosen == 0) && <>
                    <h3>Give up {roles[gameVersion][playerState.card1].name}?</h3>
                    <button type="button" class="startGameButton" onClick={confirmSelectedCardCoup}>Confirm</button>
                  </>}
                  {(coupCardChosen == 1) && <>
                    <h3>Give up {roles[gameVersion][playerState.card2].name}?</h3>
                    <button type="button" class="startGameButton" onClick={confirmSelectedCardCoup}>Confirm</button>
                  </>}
                  {(playerState.numCards == 1) && <>
                    <h3>Haha you're dead</h3>
                    <button type="button" class="startGameButton" onClick={confirmPlayerEliminated}>Boo hoo</button>
                  </>}
                </div>
              </div>
            </div>
            <div id="coupPending" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  <h1>Coup Pending</h1>
                </div>
              </div>
            </div>
            <div id="previousCoupInfo" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                {(lobbyState.playerList[lobbyState.coupGameState.coupTarget].numCards == 1) && <>
                  <h1>{lobbyState.playerList[lobbyState.coupGameState.coupTarget].nickname} was couped</h1>
                </>}
                {(lobbyState.playerList[lobbyState.coupGameState.coupTarget].numCards == 0) && <>
                  <h1>{lobbyState.playerList[lobbyState.coupGameState.coupTarget].nickname} was eliminated</h1>
                </>}
                </div>
              </div>
            </div>
            <div id="bluffCalled" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  {lobbyState.coupGameState.lastTurnPlayerTrue && <>
                    <h1>{lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].nickname} wasn't bluffing!</h1>
                  </>}
                  {!lobbyState.coupGameState.lastTurnPlayerTrue && <>
                    <h1>Your bluff was called!</h1>
                  </>}
                  {(playerState.numCards == 2 && (lobbyState.coupGameState.lastTurnPlayerRole != 3 || playerState.id == lobbyState.coupGameState.lastTurnPlayerId)) && <>
                    <h3>Choose card to give up</h3>
                    <div class="parent">
                      <div class="card hoverMe" onClick={playBluffCard1}>
                        <h1>{roles[gameVersion][playerState.card1].name}</h1>
                        <h3>{roles[gameVersion][playerState.card1].ability}</h3>
                      </div>
                      <div class="card hoverMe" onClick={playBluffCard2}>
                        <h1>{roles[gameVersion][playerState.card2].name}</h1>
                        <h3>{roles[gameVersion][playerState.card2].ability}</h3>
                      </div>
                    </div>
                  </>}
                  {(bluffCardChosen == 0) && <>
                    <h3>Give up {roles[gameVersion][playerState.card1].name}?</h3>
                    <button type="button" class="startGameButton" onClick={confirmSelectedBluffCard}>Confirm</button>
                  </>}
                  {(bluffCardChosen == 1) && <>
                    <h3>Give up {roles[gameVersion][playerState.card2].name}?</h3>
                    <button type="button" class="startGameButton" onClick={confirmSelectedBluffCard}>Confirm</button>
                  </>}
                  {!(playerState.numCards == 2 && (lobbyState.coupGameState.lastTurnPlayerRole != 3 || playerState.id == lobbyState.coupGameState.lastTurnPlayerId)) && <>
                    <h3>Haha you're dead</h3>
                    <button type="button" class="startGameButton" onClick={bluffConfirmPlayerEliminated}>Boo hoo</button>
                  </>}
                </div>
              </div>
            </div>
            <div id="bluffPending" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  <h1>Bluff Pending</h1>
                </div>
              </div>
            </div>
            <div id="previousBluffInfo" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                {lobbyState.coupGameState.lastTurnPlayerTrue && <>
                  <h1>{lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].nickname} was telling the truth!</h1>
                  {!lobbyState.playerList[lobbyState.coupGameState.playerCalledBs].isAlive && <>
                    <h3>{lobbyState.playerList[lobbyState.coupGameState.playerCalledBs].nickname} has been eliminated!</h3>
                  </>}
                  {lobbyState.playerList[lobbyState.coupGameState.playerCalledBs].isAlive && <>
                    <h3>{lobbyState.playerList[lobbyState.coupGameState.playerCalledBs].nickname} has 1 card left!</h3>
                  </>}
                </>}
                {!lobbyState.coupGameState.lastTurnPlayerTrue && <>
                  <h1>{lobbyState.playerList[lobbyState.coupGameState.playerCalledBs].nickname} called {lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].nickname}'s bluff</h1>
                  {!lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].isAlive && <>
                    <h3>{lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].nickname} has been eliminated!</h3>
                  </>}
                  {lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].isAlive && <>
                    <h3>{lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].nickname} has 1 card left!</h3>
                  </>}
                </>}
                </div>
              </div>
            </div>
            <div id="playerTargeted" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  <h1>{lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].nickname} played {roles[gameVersion][lobbyState.coupGameState.lastTurnPlayerRole].name} on you</h1>
                  <div class="parent">
                    <div class="card hoverMe" onClick={callingBs}>
                      <h1>Call BS</h1>
                      <h3>Liar liar pants on fire</h3>
                    </div>
                    <div class="card hoverMe" onClick={challengeCard}>
                      <h1>Challenge</h1>
                      {(roles[gameVersion][lobbyState.coupGameState.lastTurnPlayerRole].name == "Captain") && <>
                        <h3>With a captain or ambassador</h3>
                      </>}
                      {(roles[gameVersion][lobbyState.coupGameState.lastTurnPlayerRole].name == "Assassin") && <>
                        <h3>With contessa</h3>
                      </>}
                    </div>
                  </div>
                  {(goingToCounter == 0) && <>
                    <h3>Confirm Challenge</h3>
                    {(roles[gameVersion][lobbyState.coupGameState.lastTurnPlayerRole].name == "Captain") && <>
                      <button type="button" class="startGameButton" onClick={confirmChallengeAsCaptain}>Confirm as Captain</button>
                      <button type="button" class="startGameButton" onClick={confirmChallengeAsAmbassador}>Confirm as Ambassador</button>
                    </>}
                    {(roles[gameVersion][lobbyState.coupGameState.lastTurnPlayerRole].name == "Assassin") && <>
                      <button type="button" class="startGameButton" onClick={confirmChallengeAsContessa}>Confirm as Contessa</button>
                    </>}
                  </>}
                  {(goingToCounter == 1) && <>
                    <h3>Confirm BS</h3>
                    <button type="button" class="startGameButton" onClick={confirmBS}>Confirm</button>
                  </>}
                </div>
              </div>
            </div>
            <div id="getAssassinated" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  <h1>{lobbyState.playerList[lobbyState.coupGameState.lastTurnPlayer].nickname} assassinated you</h1>
                  {(playerState.numCards == 2) && <>
                    <h3>Choose card to give up</h3>
                    <div class="parent">
                      <div class="card hoverMe" onClick={playAssassinCard1}>
                        <h1>{roles[gameVersion][playerState.card1].name}</h1>
                        <h3>{roles[gameVersion][playerState.card1].ability}</h3>
                      </div>
                      <div class="card hoverMe" onClick={playAssassinCard2}>
                        <h1>{roles[gameVersion][playerState.card2].name}</h1>
                        <h3>{roles[gameVersion][playerState.card2].ability}</h3>
                      </div>
                    </div>
                  </>}
                  {(assassinCardChosen == 0) && <>
                    <h3>Give up {roles[gameVersion][playerState.card1].name}?</h3>
                    <button type="button" class="startGameButton" onClick={confirmSelectedCardAssassin}>Confirm</button>
                  </>}
                  {(assassinCardChosen == 1) && <>
                    <h3>Give up {roles[gameVersion][playerState.card2].name}?</h3>
                    <button type="button" class="startGameButton" onClick={confirmSelectedCardAssassin}>Confirm</button>
                  </>}
                  {(playerState.numCards == 1) && <>
                    <h3>Haha you're dead</h3>
                    <button type="button" class="startGameButton" onClick={assassinConfirmPlayerEliminated}>Boo hoo</button>
                  </>}
                </div>
              </div>
            </div>
            <div id="assassinationPending" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  <h1>Assassination Pending</h1>
                </div>
              </div>
            </div>
            <div id="captainPending" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  <h1>Captain Pending</h1>
                </div>
              </div>
            </div>
            <div id="challengePending" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  <h1>Challenge Pending</h1>
                </div>
              </div>
            </div>
            <div id="getChallenged" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  <h1>{lobbyState.playerList[lobbyState.coupGameState.playerChallenged].nickname} challenged you with {lobbyState.coupGameState.playerChallengedWith}</h1>
                  <div class="soloCard hoverMe" onClick={callingBs}>
                    <h1>Call BS</h1>
                    <h3>Liar liar pants on fire</h3>
                  </div>
                  {(goingToCounter == 1) && <>
                    <h3>Confirm BS</h3>
                    <button type="button" class="startGameButton" onClick={confirmBSAfterChallenge}>Confirm</button>
                  </>}
                </div>
              </div>
            </div>
            <div id="bluffCalledAfterChallenge" class="modal">
              <div class="modal-content">
                <div class="centerStuff">
                  {lobbyState.coupGameState.challengePlayerTrue && <>
                    <h1>{lobbyState.playerList[lobbyState.coupGameState.playerChallenged].nickname} wasn't bluffing!</h1>
                  </>}
                  {!lobbyState.coupGameState.challengePlayerTrue && <>
                    <h1>Your bluff was called!</h1>
                  </>}
                  {(playerState.numCards == 2 && (lobbyState.coupGameState.lastTurnPlayerRole != 3 || playerState.id == lobbyState.coupGameState.lastTurnPlayerId)) && <>
                    <h3>Choose card to give up</h3>
                    <div class="parent">
                      <div class="card hoverMe" onClick={playBluffCard1}>
                        <h1>{roles[gameVersion][playerState.card1].name}</h1>
                        <h3>{roles[gameVersion][playerState.card1].ability}</h3>
                      </div>
                      <div class="card hoverMe" onClick={playBluffCard2}>
                        <h1>{roles[gameVersion][playerState.card2].name}</h1>
                        <h3>{roles[gameVersion][playerState.card2].ability}</h3>
                      </div>
                    </div>
                  </>}
                  {(bluffCardChosen == 0) && <>
                    <h3>Give up {roles[gameVersion][playerState.card1].name}?</h3>
                    <button type="button" class="startGameButton" onClick={confirmSelectedBluffCardAfterChallenge}>Confirm</button>
                  </>}
                  {(bluffCardChosen == 1) && <>
                    <h3>Give up {roles[gameVersion][playerState.card2].name}?</h3>
                    <button type="button" class="startGameButton" onClick={confirmSelectedBluffCardAfterChallenge}>Confirm</button>
                  </>}
                  {!(playerState.numCards == 2 && (lobbyState.coupGameState.lastTurnPlayerRole != 3 || playerState.id == lobbyState.coupGameState.lastTurnPlayerId)) && <>
                    <h3>Haha you're dead</h3>
                    <button type="button" class="startGameButton" onClick={bluffConfirmPlayerEliminated}>Boo hoo</button>
                  </>}
                </div>
              </div>
            </div>

            {/* If not player turn only let them see stats */}
            {!isPlayerTurn && <>
              <div className="coins">
                <span>{lobbyState.playerList[lobbyState.coupGameState.playerTurn].nickname}'s turn</span>
              </div>
              <div class="turnStuff">
                <button type="button" class="startGameButton" onClick={viewStats}>View Player Stats</button>
              </div>
              {playerState.host && <>
                <div class="centerStuff">
                  <button type="button" class="startGameButton" onClick={endGame}>End Game</button>
                </div>
              </>}
            </>}

            {/* If player turn let them do turn stuff */}
            {isPlayerTurn && <>
              <div className="coins">
                <span>Your turn</span>
              </div>
              <div class="turnStuff">
                <button type="button" class="startGameButton" onClick={playTruth}>Play Truth</button>
                <button type="button" class="startGameButton" onClick={playLie}>Play Lie</button>
                <button type="button" class="startGameButton" onClick={playForeignAid}>Play foreign aid</button>
                <button type="button" class="startGameButton" onClick={playIncome}>Play Income</button>
                <button type="button" class="startGameButton" onClick={playCoup}>COUP</button>
                <button type="button" class="startGameButton" onClick={viewStats}>View Player Stats</button>
                {playerState.host && <>
                  <button type="button" class="startGameButton" onClick={endGame}>End Game</button>
                </>}
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
                <h2>Waiting for {props.lobbyState.lobbyHostName} to start the game</h2>
            </div>
        </>}
      </div>
    );
}


export default CoupContainer;