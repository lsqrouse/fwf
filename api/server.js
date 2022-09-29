const express = require("express");
var Connection = require('tedious').Connection; 
var Request = require('tedious').Request; 
const {Server} = require('socket.io'); 
const http = require('http');
const formatMessage = require('./helper/formatDate')
const cors = require("cors");


const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
});

//allows us to connect to frontend

var userList = []
var gameState = {

}
// this block will run when the client connects
io.on('connection', (socket) => {
  console.log("someone is here")

  socket.on("join_lobby", (data) => {
    console.log("Joining lobby ", data.lobbyId);
    socket.join(data.lobbyId)
    userList.push({id: socket.id})
    console.log("users is now ", userList)
    io.in(data.lobbyId).emit("players", userList)

  });

  socket.on("send_num", (data) => {
    console.log(data)
    num = data["number"]
    num++
    console.log(num)
    data["number"] = num
    socket.emit("receive_num", data)
  })

  socket.on("update_state", (data) => {
    console.log("new game state is ", data);
    socket.emit("recieve_state", data)
  });

})

io.on("disconnect", (socket) => {
  console.log(socket.id, " has left the lobby"
  )
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

// basic testing endpoint
app.get("/api", (req, res) => {
  console.log("connected to api")
    res.json({message: "Hello world!"})
});

//starts the application
server.listen(3001, () => {
  console.log("server is running")
 })