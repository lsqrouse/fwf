const express = require("express");

const PORT = process.env.PORT || 3001;
const userNames = [];
const app = express();
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({
    extended:true
}));

app.post("/create", function(req, res) {
    console.log(req);
    var num1 = Number(req.body.userName);
    var num2 = Number(req.body.lobbyID);
      
    userNames.push(num1);
    console.log("singing into lobby: " + num2);
    console.log(userNames);
  });

app.get("/api", (req, res) => {
    res.json({message: "Hello world!"})
});

app.listen(PORT, () => {
    console.log('Server listening on ' + PORT)
});