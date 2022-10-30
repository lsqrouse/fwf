
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
              res.json({username: query.uname, userId: userId,  token: '123',})
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
    
    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
      
      console.log("completed: ", rowCount, more)
      console.log("added new user")
      //TODO: get the actual userId and not just hard code it
      res.json({username: query.uname, userId: 1,  token: '123',})

    });
    connection.execSql(request);
}

function saveGameHistory(connection, lobbyState) {
  console.log(lobbyState)
  var winners = ""
  var losers = ""
  lobbyState.playerList.forEach((player) => {
    winners += player.db_id + ", "
  }) 
  request = new Request(`INSERT INTO game_history ("gamestate", "created_at", "game_id", "winners", "losers") values ('${lobbyState}', GETDATE(), '1', '${winners}', '${losers}');`, function(err) {  
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


function getStatsByUserId(connection, query, res) { 
  console.log('inside of getstas by userid', query)
    request = new Request(`SELECT w.userId, w.game_id, game_name, coalesce(wins, 0) as 'wins', coalesce(losses, 0) as 'losses' FROM (SElect COUNT(*) as 'wins', '3' as 'userId', game_id From game_history WHERE winners LIKE '%3, %' GROUP BY game_id) as w 
    full outer join 
    (SElect COUNT(*) as 'losses', '3' as 'userId', game_id From game_history WHERE losers LIKE '%3, %' GROUP BY game_id) as l on w.game_id = l.game_id
    JOIN games on w.game_id = games.id
    `, function(err) {  
    if (err) {  
        console.log(err);}  
    });  
    var stats = {userId : query.userId, games: []}
    request.on('row', function(columns) {
      var game_stats = {}
      columns.forEach(function(column) { 
        if (column.metadata.colName == 'game_name') {  
          game_stats.gameName = column.value;
        } 
        if (column.metadata.colName == 'wins') {  
          game_stats.wins = column.value;
        } 
        if (column.metadata.colName == 'losses') {  
          game_stats.losses = column.value;
        } 

      });
      stats.games.push(game_stats)
    });  

    
    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
      console.log("completed stats: ", rowCount, more)
      res.json(stats)
    });
    connection.execSql(request);  
}

function getHistoryByUserId(connection, query, res) { 
  console.log('inside of getstas by userid', query)
    request = new Request(`SELECT game_name, created_at, winners, losers from game_history JOIN games ON games.id = game_history.game_id WHERE losers LIKE '%${query.userId}, %' OR winners LIKE '%${query.userId}, %' 
    `, function(err) {  
    if (err) {  
        console.log(err);}  
    });  
    var history = []
    request.on('row', function(columns) {
      var game_history = {}
      columns.forEach(function(column) { 
        game_history[column.metadata.colName] = column.value
      });
      history.push(game_history)
    });  

    
    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
      console.log("completed stats: ", rowCount, more)
      res.json(history)
    });
    connection.execSql(request);  
}


module.exports = {getUserByUsername, createUser, saveGameHistory, createLobby, getStatsByUserId, getHistoryByUserId};