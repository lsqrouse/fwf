var Request = require('tedious').Request;
const bcrypt = require("bcrypt")


function getUserByUsername(connection, query, res) { 
  console.log("inside the getUserbyUsername function", query.uname) 
    request = new Request(`SELECT * FROM accounts WHERE username = '${query.uname}';`, function(err) {  
    if (err) {  
        console.log(err);}  
    });  
    var userId = "";
    var sentSomething = false;  
    request.on('row', function(columns) {
        columns.forEach(function(column) { 
          if (column.metadata.colName == 'id') {  
            userId = column.value;
          } 
          if (column.metadata.colName == 'pass') {  
            if (column.value == query.pass) {
              res.json({username: query.uname, userid: userId,  token: '123',})
              sentSomething = true;
            }
          } 

        });  
    });  

    request.on('done', function(rowCount, more) {
      console.log(rowCount + ' rows returned', more);  
    });  
    
    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
      console.log("completed login: ", rowCount, more)
      if (!sentSomething) {
        res.json({ token: "BAD_LOGIN"})
      }
    });
    connection.execSql(request);  
}

function createUser(connection, query, res) {
  console.log(query);
  request = new Request(`INSERT INTO accounts (username, pass, email) VALUES ('${query.uname}', '${query.pass}', '${query.email}');`, function(err) {  
    if (err) {  
        console.log(err);}  
    });  

    request.on('done', function(rowCount, more) {
      console.log(rowCount + ' rows returned', more);  
    });  
    
    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
      
      console.log("completed: ", rowCount, more)
      console.log("added new user")
      res.json({uname: query.uname, token: '123'})

    });
    connection.execSql(request);
}

function saveGameHistory(connection, lobbyState) {
  request = new Request(`INSERT INTO game_history ("gamestate", "created_at") values ('${lobbyState}', GETDATE());`, function(err) {  
    if (err) {  
        console.log("we have an error", err);}  
    });  

    request.on('done', function(rowCount, more) {
      console.log(rowCount + ' rows returned', more);  
    });  
    
    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
      
      console.log("completed: ", rowCount, more)
      console.log("Saved a game")
    });
    connection.execSql(request);
}

function createLobby(connection, lobbyState) {
  request = new Request(`INSERT INTO lobbies ("gamestate", "created_at") values ('${lobbyState}', GETDATE());`, function(err) {  
    if (err) {  
        console.log("we have an error", err);}  
    });  

    request.on('done', function(rowCount, more) {
      console.log(rowCount + ' rows returned', more);  
    });  
    
    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
      
      console.log("completed: ", rowCount, more)
      console.log("Created a new lobby")
    });
    connection.execSql(request);
}


module.exports = {getUserByUsername, createUser, saveGameHistory, createLobby};