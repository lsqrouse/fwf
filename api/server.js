const express = require("express");
var Connection = require('tedious').Connection; 
var Request = require('tedious').Request; 
var socketio = require('socket.io'); 
const http = require('http');
const formatMessage = require('./helper/formatDate')
const {
  getActiveUser,
  exitRoom,
  newUser,
  getIndividualRoomUsers
} = require('./helper/userHelper');
var TYPES = require('tedious').TYPES; 

const PORT = process.env.PORT || 3001;

const app = express();

const server = http.createServer(app);
const io = socketio(server);

// this block will run when the client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
      const user = newUser(socket.id, username, room);
  
      socket.join(user.room);
  
      // General welcome
      socket.emit('message', formatMessage("WebCage", 'Messages are limited to this room! '));
  
      // Broadcast everytime users connects
      socket.broadcast
        .to(user.room)
        .emit(
          'message',
          formatMessage("WebCage", `${user.username} has joined the room`)
        );
  
      // Current active users and room name
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getIndividualRoomUsers(user.room)
      });
    });
  
    // Listen for client message
    socket.on('chatMessage', msg => {
      const user = getActiveUser(socket.id);
  
      io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
  
    // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = exitRoom(socket.id);
  
      if (user) {
        io.to(user.room).emit(
          'message',
          formatMessage("WebCage", `${user.username} has left the room`)
        );
  
        // Current active users and room name
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getIndividualRoomUsers(user.room)
        });
      }
    });
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
        connection.close();
    });
    connection.execSql(request);  
}

var connection = new Connection(db_config);  
connection.on('connect', function(err) {  
    // If no error, then good to proceed.
    console.log("Connected, testing...");
    executeStatement();  
  
});

// connection.connect();

//basic testing endpoint
app.get("/api", (req, res) => {
    res.json({message: "Hello world!"})
});

//starts the application
app.listen(PORT, () => {
    console.log('Server listening on ' + PORT)
});