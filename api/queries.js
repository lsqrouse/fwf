var Request = require('tedious').Request; 

function getUserByUsername(connection, query, res) { 
  console.log("inside the getUserbyUsername function", query.uname) 
    request = new Request(`SELECT * FROM accounts WHERE username = '${query.uname}';`, function(err) {  
    if (err) {  
        console.log(err);}  
    });  
    var userId = "";  
    request.on('row', function(columns) {
        columns.forEach(function(column) { 
          if (column.metadata.colName == 'id') {  
            userId = column.value;
          } 
          if (column.metadata.colName == 'pass') {  
            if (column.value == query.pass) {
              res.json({userId: userId, token: '123'})
            }
          } 

        });  
    });  

    request.on('done', function(rowCount, more) {
      console.log(rowCount + ' rows returned', more);  
    });  
    
    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
      console.log("completed: ", rowCount, more)
    });
    connection.execSql(request);  
}

function createUser(connection, query, res) {
  console.log("inside create user")
}

module.exports = getUserByUsername;