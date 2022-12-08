// import * as queries from './queries.js'

const express = require("express");
var Connection = require('tedious').Connection; 
var Request = require('tedious').Request; 
const {Server} = require('socket.io'); 
const http = require('http');
const formatMessage = require('./helper/formatDate')
const cors = require("cors");
const {getUserByUsername, createUser, saveGameHistory, createLobby, getStatsByUserId, getHistoryByUserId, login} = require('./queries.js')
const bcrypt = require("bcrypt");
const { NONAME } = require("dns");
const mafiaData = require("./mafia/src/data/data");

const PORT = process.env.PORT || 8080;
const userNames = [];
const app = express();
app.use(cors());
app.use(express.static(process.cwd()+"/client/build/"));
console.log(process.cwd()+"/client/build/")

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
});

/*
 *  Constant Caching variables 
 */
//allows us to connect to frontend
var lobbies = {
  'ABC' : {
    lobbyId: 'ABC',
    playerList: [],
    whoseTurn: '',
    counter: 0,
    lobbyHost: undefined,
    chatLog: [],

  }
}

var curLobbyId = 0;

var players = {

}

// this block will run when the client connects
io.configure(function() {
  // Force websocket
  io.set('transports', ['websocket']);

  // Force SSL
  io.set('match origin protocol', true);
});
io.on('connection', (socket) => {
  socket.on("join_lobby", (data) => {
    console.log("Joining lobby ", data);
    socket.join(data.lobbyId)
    var gameState = {}
    if(lobbies.hasOwnProperty(data.lobbyId)) {
      gameState = lobbies[data.lobbyId]
    } else {
      //means the lobby doesn't exist, need to let that happen somehow
      console.log("Player tried to join lobby that doesn't exist")
      return
    }
    //caches that the player is in a given lobby
    players[socket.id] = data.lobbyId;

    //TODO this should get set at lobby creation time
    if (gameState.lobbyHost == undefined) {
      gameState.lobbyHost = socket.id;
    }

  //gameState.playerList.push({id: socket.id, host: data.host, nickname: data.nickname, gamePlayerState: data.gamePlayerState})
    //io.in(gameState.lobbyId).emit("receive_lobby_state", gameState)
    var newPlayerState = {
      id: socket.id,
      db_id: "NONE",
      lobbyId: data.lobbyId,
      nickname: data.nickname,
      host: data.host,
      gamePlayerState: {
        role: '',
        isAlive: true,
        message: ''
      }
    }
    gameState.playerList.push(newPlayerState)
    io.in(gameState.lobbyId).emit("receive_lobby_state", gameState)
    socket.emit("recieve_player_state", newPlayerState)
  });

  socket.on("update_lobby_state", (data) => {
    console.log("Updating Lobby " + data.lobbyId + " state to:", data);
    lobbies[data.lobbyId] = data;
    io.in(data.lobbyId.toString()).emit("receive_lobby_state", data)
    console.log("updated")
  });

  socket.on("start_game", (data) => {
    console.log("someone starting the game with data ", data)
    var lobbyState = {}
    if(lobbies.hasOwnProperty(data.lobbyId)) {
      lobbyState = lobbies[data.lobbyId]
    } else {
      //means the lobby doesn't exist, need to let that happen somehow
      console.log("Player tried to join lobby that doesn't exist")
      return
    }
    var assignments = [];
    var left = JSON.parse(JSON.stringify(data.selectedRoles));
    for (let i of lobbyState.playerList) {
      if (left.length > 0) {
        var ran = Math.floor(Math.random() * left.length);
        var newPlayerState = {
          id: i.id,
          db_id: i.db_id,
          lobbyId: data.lobbyId,
          nickname: i.nickname,
          host: i.host,
          gamePlayerState: {
            role: left[ran],
            isAlive: true,
            message: ''
          }
        }
        left.splice(ran, 1);
        assignments.push(newPlayerState)
      } else {
        var newPlayerState = {
          id: i.id,
          db_id: i.db_id,
          lobbyId: data.lobbyId,
          nickname: i.nickname,
          host: i.host,
          gamePlayerState: {
            role: 'Villager',
            isAlive: true,
            message: ''
          }
        }
        assignments.push(newPlayerState)
      }
      //console.log(newPLIST);
    }

    io.in(data.lobbyId).fetchSockets().then((response) => {
      response.forEach((socket) => {
        assignments.forEach((newPlayerState) => {
          if (newPlayerState.id == socket.id) {
            console.log("updating a player state ", newPlayerState)

            //console.log(newPlayerState);
            //console.log(newPLIST);
            socket.emit("recieve_player_state", newPlayerState);
          }
        })  
      })
        lobbyState.playerList = assignments;
        lobbyState.gameState.gameScreen = "Game";
        lobbies[data.lobbyId] = lobbyState
        console.log("updated lobby state is ", lobbyState)
        io.in(data.lobbyId).emit("receive_lobby_state", lobbyState)
      });

    //console.log(lobbyState.playerList);
  });

  socket.on("end_game", (lobbyState) => {
    console.log("Saving game that took place in " + lobbyState.lobbyId);
    saveGameHistory(connection, lobbyState)
  });

  socket.on("disconnect", (data) => {
    var lobbyState = {}
    if(players.hasOwnProperty(socket.id)) {
      lobbyState = lobbies[players[socket.id]]
    } else {
      //means the lobby doesn't exist, need to let that happen somehow
      console.log("Player that no longer exists tried to leave")
      return
    }
    console.log("Player ".concat(socket.id).concat(" is leaving") )
    delete players[socket.id];
    //removes player from game list
    const index = lobbyState.playerList.findIndex(el => {
      return el.id === String(socket.id);
    }); 
    if (index > -1) { // only splice array when item is found
      lobbyState.playerList.splice(index, 1); // 2nd parameter means remove one item only
    }
    
    //test to see if the lobby should be removed
    if (lobbyState.playerList.length == 0) {
      //TODO probably need more cleanup than this
      console.log("DELETED LOBBY ", lobbyState.lobbyId)
      delete lobbies[lobbyState.lobbyId]
      return
    }
    //update the lobby's host if necessary
    if (lobbyState.lobbyHost == socket.id) {
      console.log("host is leaving, updating state")
      lobbyState.lobbyHost = lobbyState.playerList[0].id
      lobbyState.playerList[0].host = true
    }
    lobbies[players[socket.id]] = lobbyState
    console.log("new state is ", lobbyState)
    //reflects changes across other cleints
    io.in(lobbyState.lobbyId).emit("receive_lobby_state", lobbyState)
  })


  // ---------- Mafia-specific socket events and funtions ----------
  
  socket.on("mafia_request_data", (lobbyId) => {
    const data = {
      roles: mafiaData.roles,
      teams: mafiaData.teams
    };
    io.in(lobbyId).emit("mafia_data", data);
  });

  socket.on("mafia_check_night_end", (lobbyId) => {
    console.log("Checking if night phase can be ended")

    if(lobbies.hasOwnProperty(lobbyId)) {
      const lobbyState = lobbies[lobbyId]
      const players = lobbyState.playerList;

      let allAbilitiesSubmitted = true;
      let allMafiaVotesSubmitted = true;

      const submittedAbilities = lobbyState.gameState.history[lobbyState.gameState.phaseNum].night;
      const mafiaVotes = lobbyState.gameState.history[lobbyState.gameState.phaseNum].mafiaVotes;

      let playerIdMap = {};
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        playerIdMap[player.id] = player;
      }

      // Check if everyone has submitted their night ability/pressed OK button
      for (let i = 0; i < players.length; i++) {
        if (players[i].gamePlayerState.isAlive && !submittedAbilities.hasOwnProperty(players[i].id)) {
          if (players[i].gamePlayerState.role !== "Mafia") {
            console.log(`${players[i].nickname} (${players[i].id}) has not submitted their ability/pressed OK`);
            allAbilitiesSubmitted = false;
          }
        }
      }
      // Check all mafia members have voted for the night's kill target
      const mafiaPlayers = players.filter(player => 
        player.gamePlayerState.role == "Mafia" ||
        player.gamePlayerState.role == "Distractor" ||
        player.gamePlayerState.role == "Framer" ||
        player.gamePlayerState.role == "Informant"
      ); // This is such bad practice but it works
      for (let i = 0; i < mafiaPlayers.length; i++) {
        if (mafiaPlayers[i].gamePlayerState.isAlive && !mafiaVotes.hasOwnProperty(mafiaPlayers[i].id)) {
          console.log(`${mafiaPlayers[i].nickname} (${mafiaPlayers[i].id}) has not submitted their mafia kill vote`);
          allMafiaVotesSubmitted = false;
        }
      }

      if (allAbilitiesSubmitted && allMafiaVotesSubmitted) {
        // ----- First need to check there are no ties in the mafia kill vote -----
        let voteTie = false;
        let mafiaKill = null;
        // Check mafia votes
        // scope voting vars
        {
          // Count the votes
          let mafiaVotesCount = {};
          for (let i = 0; i < Object.keys(mafiaVotes).length; i++) {
            const choice = mafiaVotes[Object.keys(mafiaVotes)[i]];
            if (mafiaVotesCount.hasOwnProperty(choice)) {
              mafiaVotesCount[choice] = mafiaVotesCount[choice] + 1;
            } else {
              mafiaVotesCount[choice] = 1;
            }
          }
          // See who has most votes
          let mostVoted = Object.keys(mafiaVotesCount)[0];
          let mostVotedTie = null;
          for (let i = 1; i < mafiaVotesCount.length; i++) {
            const contender = Object.keys(mafiaVotesCount)[i];
            if (mafiaVotesCount[contender] > mafiaVotesCount[mostVoted]) {
              mostVoted = contender;
              mostVotedTie = null;
            } else if (mafiaVotesCount[contender] === mafiaVotesCount[mostVoted]) {
              mostVotedTie = contender;
            }
          }
          if (mostVotedTie !== null) {
            voteTie = true;
          }
          mafiaKill = mostVoted;
          lobbyState.gameState.history[lobbyState.gameState.phaseNum].mafiaKill = mafiaKill;
        }
        
        if (!voteTie) {
          // Now we can process the events
          let abilitiesList = Object.keys(submittedAbilities).map(key => 
            ({player: key, targets: submittedAbilities[key].targets, ability: submittedAbilities[key].ability})
          );

          // Add the mafia kill to the abilitiesList as a kill
          const mafiaKiller = Object.keys(mafiaPlayers)[0];
          abilitiesList.push({player: mafiaKiller, targets: mafiaKill === null ? [] : [mafiaKill], ability: "kill"});

          // Clear messages
          lobbyState.gameState.messages = {};

          // ----- First, deal with the SWAP ability -----
          const swaps = abilitiesList.filter(a => a.ability === "swap");
          swaps.forEach(swap => {
            const t1 = swap.targets[0];
            const t2 = swap.targets[1];

            if (t1 !== null && t2 !== null) {
              let newAbilitiesList = [...abilitiesList];

              for (let i = 0; i < abilitiesList.length; i++) {
                const a = abilitiesList[i];
                const i1 = a.targets.findIndex(t => t === t1);
                const i2 = a.targets.findIndex(t => t === t2);

                if (i1 !== -1) { newAbilitiesList[i].targets[i1] = t2; }
                if (i2 !== -1) { newAbilitiesList[i].targets[i2] = t1; }
              };

              abilitiesList = newAbilitiesList;
            }
          });

          // ----- Second, deal with the BLOCK ability -----
          const blocks = abilitiesList.filter(a => a.ability === "block");
          // Remove abilities that get blocked, unless the target is a blocking role (they can't be blocked)
          abilitiesList.filter(a => {
            a.ability == "block" && playerIdMap[a.targets[0]].gamePlayerState.role !== "Drunk" && playerIdMap[a.targets[0]].gamePlayerState.role !== "Distractor" 
          })

          // ----- Third, deal with KILLS, including BOMB and MAFIA KILL by marking targets for death
          let markedForDeath = [];
          // There are 3 ways to be killed: 1) Mafia 2) Vigilante 3) Bomb. Need to deal with all 3 cases.
          // Deal with Mafia and Vigilante kills
          const kills = abilitiesList.filter(a => a.ability === "kill");
          kills.forEach(kill => {
            const killTarget = playerIdMap[kill.targets[0]];
            if (killTarget) {
              markedForDeath.push(kill.targets[0]);
              // Killer kills a Bomb, so killer gets marked for death
              if (killTarget.gamePlayerState.role === "Bomb") {
                markedForDeath.push(kill.player);
              }
            }
          });

          // ----- Fourth, deal with the SAVE ability -----
          const saves = abilitiesList.filter(a => a.ability === "save");
          saves.forEach(save => {
            let targetIndex = markedForDeath.indexOf(save.targets[0]);
            // Remove saved target from being marked for death
            if (targetIndex !== -1) {
              markedForDeath.splice(targetIndex);
              abilitiesList.splice(abilitiesList.indexOf(save), 1);
            }
          });

          // ----- Fifth, deal with the FRAME ability -----
          let framedTargets = [];
          const frames = abilitiesList.filter(a => a.ability === "frame");
          frames.forEach(frame => {
            framedTargets.push(frame.targets[0]);
          });

          // ----- Sixth, deal with the RESSURECT ability
          const ressurections = abilitiesList.filter(a => a.ability === "ressurect");
          ressurections.forEach(ressurect => {
            playerIdMap[ressurect.targets[0]].isAlive = true;
          });

          // ----- Seventh, deal with the INVESTIGATE ability -----
          const investigations = abilitiesList.filter(a => a.ability === "investigate");
          investigations.forEach(investigation => {
            // TODO: Send alert message to the detective
            const targetRole = playerIdMap[investigation.targets[0]].gamePlayerState.role;
            let targetMafia = false;
            if (targetRole == "Mafia" || targetRole == "Distractor" || targetRole == "Framer" || targetRole == "Informant") {
              targetMafia = true;
            }
            if (!lobbyState.gameState.messages.hasOwnProperty(investigation.player)) {
              lobbyState.gameState.messages[investigation.player] = "";
            }
            lobbyState.gameState.messages[investigation.player] +=
              `Your investigations lead you to believe your target is ${targetMafia ? "part of the the Mafia!" : " not part of the Mafia."}\n`;
          });

          // ----- Eighth, deal with the IDENTIFY ability -----
          const identifies = abilitiesList.filter(a => a.ability === "identify");
          identifies.forEach(identify => {
            // TODO: Send alert message to the informant
            const targetRole = playerIdMap[identify.targets[0]].gamePlayerState.role;
            if (!lobbyState.gameState.messages.hasOwnProperty(identify.player)) {
              lobbyState.gameState.messages[identify.player] = "";
            }
            lobbyState.gameState.messages[identify.player] +=
              `After snooping around, you find out your target is a ${targetRole}.`;
          });

          // Finally, update the game state by killing off dead players
          markedForDeath.forEach(id => {
            if (id !== null) {
              playerIdMap[id].gamePlayerState.isAlive = false;
            }
          });

          // CHECK WIN CONDITIONS
          //checkMafiaWin(lobbyState);
          
          // Initialize empty night summary string
          let nightSummary = ""
          nightSummary += `Night ${lobbyState.gameState.phaseNum} has ended. You can turn around and face each other now.`;
          // Add dead players' names to summary list
          markedForDeath.forEach(p => {
            nightSummary += `${playerIdMap[p].nickname} has died :(\n`
          });
          // Add ressurected players' names to summary list.
          ressurections.forEach(p => {
            nightSummary += `${p.targets[0]} has been ressurected! :)\n`;
          });
          // Set the message
          lobbyState.gameState.allPlayersMessage = nightSummary;
          // Set the next phase
          lobbyState.gameState.currentPhase = "day";
          // Emit to clients.
          io.in(lobbyState.lobbyId).emit("receive_lobby_state", lobbyState);
          io.in(lobbyState.lobbyId).emit("mafia_night_phase_ended", lobbyState);
          console.log("Ended night phase " + lobbyState.gameState.phaseNum);
        } else {
          io.in(lobbyState.lobbyId).emit("receive_lobby_state", lobbyState);
        }
      } else {
        io.in(lobbyState.lobbyId).emit("receive_lobby_state", lobbyState);
      }
    } else {
      //means the lobby doesn't exist, need to let that happen somehow
      console.log("Tried to check night phase for lobby that doesn't exist")
      return;
    }
  })

  socket.on("mafia_check_day_end", (lobbyId) => {
    console.log("Checking if day phase can be ended")
    // Day ends when everyone has voted and there isn't a tie
    if (lobbies.hasOwnProperty(lobbyId)) {
      const lobbyState = lobbies[lobbyId]
      const votes = lobbyState.gameState.history[lobbyState.gameState.phaseNum].day;
      let playerIdMap = {};
      for (let i = 0; i < lobbyState.playerList.length; i++) {
        const player = lobbyState.playerList[i];
        playerIdMap[player.id] = player;
      }

      // Check everyone has voted
      let allDayVotesSubmitted = true;
      for (let i = 0; i < lobbyState.playerList.length; i++) {
        if (lobbyState.playerList[i].gamePlayerState.isAlive && !votes.hasOwnProperty(lobbyState.playerList[i].id)) {
          console.log(`${lobbyState.playerList[i].nickname} (${lobbyState.playerList[i].id}) has not submitted their day vote`);
          allDayVotesSubmitted = false;
        }
      }

      if (allDayVotesSubmitted) {
        // Count the votes
        let votesCount = {};
        for (let i = 0; i < Object.keys(votes).length; i++) {
          const choice = votes[Object.keys(votes)[i]];
          if (votesCount.hasOwnProperty(choice)) {
            votesCount[choice] = votesCount[choice] + 1;
          } else {
            votesCount[choice] = 1;
          }
        }
        // See who has most votes
        let mostVoted = Object.keys(votesCount)[0];
        let mostVotedTie = null;
        for (let i = 1; i < votesCount.length; i++) {
          const contender = Object.keys(votesCount)[i];
          if (votesCount[contender] > votesCount[mostVoted]) {
            mostVoted = contender;
            mostVotedTie = null;
          } else if (votesCount[contender] === votesCount[mostVoted]) {
            mostVotedTie = contender;
          }
        }

        if (mostVotedTie === null) {
          // If no tie, update state
          lobbyState.gameState.history[lobbyState.gameState.phaseNum].dayVote = mostVoted;

          if (mostVoted !== null) {
            playerIdMap[mostVoted].gamePlayerState.isAlive = false;
          }

          // Clear messages
          lobbyState.gameState.messages = {};

          // CHECK WIN CONDITIONS
          //checkMafiaWin(lobbyState);

          // Initialize empty day summary string
          let daySummary = ""
          daySummary += `Day ${lobbyState.gameState.phaseNum} has ended. Turn around and face away from each other now.`;
          // Add voted player's name to summary list
          daySummary += `${playerIdMap[mostVoted].nickname} has been voted off.`;
          // Set the message
          lobbyState.gameState.allPlayersMessage = daySummary;
          // Set the next phase
          lobbyState.gameState.currentPhase = "night";
          lobbyState.gameState.phaseNum = lobbyState.gameState.phaseNum + 1;

          // Emit to clients.
          io.in(lobbyState.lobbyId).emit("receive_lobby_state", lobbyState);
          io.in(lobbyState.lobbyId).emit("mafia_day_phase_ended", lobbyState);
          console.log("Ended day phase " + lobbyState.gameState.phaseNum);
        } else {
          io.in(lobbyState.lobbyId).emit("receive_lobby_state", lobbyState);
        }
      } else {
        io.in(lobbyState.lobbyId).emit("receive_lobby_state", lobbyState);
      }
    } else {
      //means the lobby doesn't exist, need to let that happen somehow
      console.log("Tried to check night phase for lobby that doesn't exist")
      return;
    }
  });

  // end of Mafia-specific socket events

});

var db_config = {  
    server: 'fwf.database.windows.net',  //update me
    authentication: {
        type: 'default',
        options: {
            userName: 'fwf_admin', //update me
            password: 'Us$&18gS2Yoz'  //update me
        }
    },
    options: {
        // If you are on Microsoft Azure, you need encryption:
        encrypt: true,
        database: 'fwf_dev'  //update me
    }
};  

function executeStatement() {  
    request = new Request("SELECT * FROM testing_table;", function(err) {  
    if (err) {  
        console.log(err);}  
    });  
    var result = "";  
    request.on('row', function(columns) {  
        columns.forEach(function(column) {  
          if (column.value === null) {  
            console.log('NULL');  
          } else {  
            result+= column.value + " ";  
          }  
        });  
        console.log(result);  
        result ="";  
    });  

    request.on('done', function(rowCount, more) {  
    console.log(rowCount + ' rows returned');  
    });  
    
    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
        // connection.close();
    });
    connection.execSql(request);  
}


var connection = new Connection(db_config);  
connection.on('connect', function(err) {  
  if (err) {
    console.error('Connection error', err);
 } else {
    console.log('Connected');
 }
    // If no error, then good to proceed.
    console.log("Connected, testing...");
    executeStatement();  
  
});

connection.connect();

// basic testing endpoint
app.get("/api", (req, res) => {
  console.log("connected to api")
    res.json({message: "Hello world!"})
});
 
app.get("/api/accounts/login", (req, res) => {
  console.log("received request for login", req.query)
  login(connection, req.query, res)
})

app.get("/api/accounts/getUser", (req, res) => {
  console.log("received request to lookup user", req.query.username);
  getUserByUsername(connection, req.query, res)
})

app.get("/api/accounts/create", (req, res) => {
  console.log("received request to create an account")
  
  createUser(connection, req.query , res)
})

let doingDB = false
app.get("/api/accounts/stats", (req, res) => {
  console.log("received request to create an account")
  doingDB = true
  getStatsByUserId(connection, req.query , res)
  doingDB = false
})

app.get("/api/accounts/history", (req, res) => {
  console.log("received request to create an account")
  getHistoryByUserId(connection, req.query , res)
  
})

app.get("/api/lobby/create", (req, res) => {
  //TODO
  // generate lobby code here and place it into lobby object
  console.log("received request to make new lobby")
  var newLobby = {
    lobbyId: curLobbyId.toString() + "L",
    playerList: [],
    lobbyHost: undefined,
    lobbyCode: curLobbyId.toString(),
    chatLog: [{msg: 'welcome to lobby'}],
    game: 'mafia', // name of the game (must correspond to game represented by gameState object)
    gameState: { // this object gets swapped out depending on the game

      mafiaList: [],
      alivePlayerList: [],
      deadPlayerList: [],
      currentPhase: 'night',     // 'day' or 'night'
      phaseNum: 1, // the nth 'day' or 'night', starting with Night 1, followed by Day 1, Night 2, Day 2, etc.
      dayPhaseTimeLimit: 90,
      nightPhaseTimeLimit: 90,
      nightPhaseStarted: false, // flag
      nightPhaseEnded: false,   // flag
      allPlayersMessage: 'Do Nothing', // message to be shown to everyone in alerts screen
      history: {},
      messages: {},
      settings: {
        selectedRoles: ["Villager"]
      },
      gameScreen: 'Settings'
    }
  }
  curLobbyId++
  res.json(newLobby)
  lobbies[newLobby.lobbyId] = newLobby;
  console.log("lobbies is now ", lobbies)

  //TODO 
  // save lobby data in database
  createLobby(connection, newLobby)
  
})

app.get("/api/lobby/join", (req, res) => {
  var gameState = {};
  var lobbyId = req.query.lobbyCode
  console.log("Client trying to join lobby: ", req.query)
  if(lobbies.hasOwnProperty(lobbyId)) {
    gameState = lobbies[lobbyId]
  } else {
    //means the lobby doesn't exist, need to let that happen somehow
    console.log("Player tried to join lobby that doesn't exist")
    return
  }
  res.json(gameState)
})

//starts the application
server.listen(8080, () => {
  console.log("server is running")
 })