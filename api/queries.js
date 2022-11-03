const nodemailer = require('nodemailer')
const crypto = require('crypto')
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
              res.json({uname: query.uname, token: '123'})
            }
          } 

        });  
    });  

    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
      console.log("completed: ", rowCount, more)
    });
    connection.execSql(request);  
}


function getUserByEmail(connection, query, res) { 
  console.log("inside the getUserbyEmail function", query.email) 
    request = new Request(`SELECT * FROM accounts WHERE email = '${query.email}';`, function(err) {  
    if (err) {  
        console.log(err);}  
    });  
    var token = "";  
    request.on('row', function(columns) {
      let userEmail = ""
        columns.forEach(function(column) { 
          if (column.metadata.colName == 'email') {
            userEmail = column.value
            console.log("found email")
          }
        });
        if (userEmail == ""){
          console.log("bad bad")
          return
        }
        console.log("got email as ", userEmail)
        token = crypto.randomBytes(20).toString('hex')
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'fwf.reset@gmail.com',
            pass: 'fwfpasswordreset'
          }
        }) 
        const mailOptions = {
          from: 'fwf.reset@gmail.com',
          to: userEmail,
          subject: 'Link to Reset Password',
          text: `You are receiving this email as someone has requested to reset the password for your Fun with Friends account.\n\n` +
          `Please click the following link to complete resetting your password\n\n` +
          `http://localhost/accounts/resetPass/${token}\n\n` +
          `If you did not request a password reset please ignore this email and your password will not change.`
        } 
        transporter.sendMail(mailOptions, function(err, response) {
          if (err)  {
            console.log("ERror sending email ", err)
          } else {
            res.json({status: 200, message: "email sent"})
          }
        })
    });  

    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
      console.log("completed: ", rowCount, more)
      addResetToken(connection, query.email, token)

    });
    connection.execSql(request);  
}

function addResetToken(connection, email, token) {
  request = new Request(`UPDATE game_history SET resetToken = '${token}' WHERE email = ${email}`, function(err) {  
    if (err) {  
        console.log("we have an error", err);}  
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


module.exports = {getUserByUsername, createUser, saveGameHistory, createLobby, getUserByEmail};