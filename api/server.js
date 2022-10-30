// import * as queries from './queries.js'

const express = require("express");
var Connection = require('tedious').Connection; 
var Request = require('tedious').Request; 
const {Server} = require('socket.io'); 
const http = require('http');
const formatMessage = require('./helper/formatDate')
const cors = require("cors");
const {getUserByUsername, createUser, saveGameHistory, createLobby, getStatsByUserId, getHistoryByUserId} = require('./queries.js')
const bcrypt = require("bcrypt");
const { NONAME } = require("dns");



const PORT = process.env.PORT || 3001;
const userNames = [];
const app = express();
app.use(cors());


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

  }
}

var curLobbyId = 0;

var players = {

}

// this block will run when the client connects
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

    var newPlayerState = {
      id: socket.id,
      db_id: "NONE",
      lobbyId: data.lobbyId,
      role: '',
      host: data.host,
      isAlive: data.isAlive,
      nickname: data.nickname,
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
          role: left[ran],
          host: i.host,
          nickname: i.nickname
        }
        left.splice(ran, 1);
        assignments.push(newPlayerState)
      } else {
        var newPlayerState = {
          id: i.id,
          db_id: i.db_id,
          lobbyId: data.lobbyId,
          role: 'Villager',
          host: i.host,
          nickname: i.nickname
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
        lobbyState.gameScreen = "Game";
        lobbies[data.lobbyId] = lobbyState
        console.log("updated lobby state is ", lobbyState)
        io.in(data.lobbyId).emit("receive_lobby_state", lobbyState)
      });

    //console.log(lobbyState.playerList);
  });

  socket.on("end_night_phase", (data) => {
    console.log("Night phase ending with data", data)
    var lobbyState = {}
    if(lobbies.hasOwnProperty(data.lobbyId)) {
      lobbyState = lobbies[data.lobbyId]

      // Adjust game data with night summary
      // Initialize empty night summary string
      let nightSummary = ""

      // Go through graveyard and find all dead players
      for (let deadPlayer = 0; deadPlayer < lobbyState.gameState.deadPlayerList.length; deadPlayer++)
      {
        // Add dead player name to summary list
        nightSummary += "Oh no! " + deadPlayer.nickname + " has died :("
      }
      lobbyState.gameState.nightEventSummary = nightSummary;

      //reflects changes across other cleints
      io.in(lobbyState.lobbyId).emit("recieve_game_state", gameState)
    } else {
      //means the lobby doesn't exist, need to let that happen somehow
      console.log("Player tried to join lobby that doesn't exist")
      return
    }
    console.log(lobbyState)
  })

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

})


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
  getUserByUsername(connection, req.query, res)
})

app.get("/api/accounts/create", (req, res) => {
  console.log("received request to create an account")
  
  createUser(connection, req.query , res)
})

app.get("/api/accounts/stats", (req, res) => {
  console.log("received request to create an account")
  
  getStatsByUserId(connection, req.query , res)
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
    gameState: {
      whoseTurn: '',
      game: 'mafia',
      mafiaList: [],
      alivePlayerList: [],
      deadPlayerList: [],
      currentPhase: 'day',
      phaseNum: 0,
      dayPhaseTimeLimit: 90,
      nightPhaseTimeLimit: 90,
      nightPhaseStarted: false,
      nightPhaseEnded: false,
      nightEventSummary: '',
      framerTarget: '',
      ressurectionistTarget: '',
      executionerTarget: '',
      allPlayersMessage: 'Do Nothing'
    },
    settings: {
      selectedRoles: ["Villager"]
    },
    gameScreen: 'Settings',
    game: ''
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
server.listen(3001, () => {
  console.log("server is running")
 })