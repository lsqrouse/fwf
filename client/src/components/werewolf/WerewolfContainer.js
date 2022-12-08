import { useState } from "react";
import { useSelector } from "react-redux";


function WerewolfContainer(props) {
    //console.log("LOADED WEREWOLF");

    const numPlayers = useSelector((state) => state.lobbyState.playerList).length;
    //const gameScreen = useSelector((state) => state.lobbyState.gameState.gameScreen);
    const playerState = useSelector((state) => state.playerState);
    const socket = props.socket;
    const lobbyState = useSelector((state) => state.lobbyState);
    const [warnMessage, setWarnMessage] = useState("");
    var gameStart = false || lobbyState.wolfGameState.gameStarted;

    var seerTurn = false || lobbyState.wolfGameState.playerTurn == 1;
    var isSeer = false || playerState.role == "seer";

    var wolfTurn = false || lobbyState.wolfGameState.playerTurn == 0;
    var isWolf = false || playerState.role == "werewolf";

    var robTurn = false || lobbyState.wolfGameState.playerTurn == 2;
    var isRob = false || playerState.role == "robber";

    var trblTurn = false || lobbyState.wolfGameState.playerTurn == 3;
    var isTrbl = false || playerState.role == "troublemaker";

    var dayTurn = false || lobbyState.wolfGameState.playerTurn == 4;

    //console.log('GAME STARTED STATE', gameStart);
    const [roleAction, setRoleAction] = useState("");
    const [isSeeing, setisSeeing] = useState(false);
    const [msg, setMsg] = useState('');
    var wolves = [''];

    var uIndex = 0;

    for (var i = 0; i < lobbyState.playerList.length; i++) {
        if (lobbyState.playerList[i].nickname == playerState.nickname) {
            uIndex = i;
        }
    }

    //const [isSeer, setisSeer] = useState(false || playerState.role == "seer");

    const minPlayers = 3;

    var roles = ["werewolf", "werewolf", "seer", "robber", "troublemaker", "villager"]; //load in roles alternative way here


    function startGame() {
        console.log('starting werewolf');
        //console.log('PLAYER STATE', playerState);
        //console.log('LOBBY STATE', lobbyState);
        if (numPlayers <= 2) {
            alert("not enough players");
            return;
        } else if (numPlayers == 4) {
            roles.push("villager");
        } else if (numPlayers == 5) {
            roles.push("villager");
            roles.push("villager");
        } else if (numPlayers > 5) {
            alert("Too many players");
            return;
        }

        roles = shuffle(roles);

        if (lobbyState.playerList != undefined) {
            if (roles.length != lobbyState.playerList.length) {
                console.log("ROLE AND PLAYER LENGTH DO NOT MATCH");
            }

            for (var i = 0; i < lobbyState.playerList.length; i++) {
                lobbyState.playerList[i].role = roles.pop();
                lobbyState.playerList[i].name = playerState.nickname;
            }
            var midCards = roles;
            //console.log("midcards: " + midCards);
            lobbyState.wolfGameState.midCards = midCards;
            socket.emit("update_lobby_state", lobbyState); //
            socket.emit("start_wolf_game", lobbyState);
        }
    }
    //console.log("SEER TURN: ", seerTurn);
    if (gameStart && wolfTurn) {
        //console.log("SHOWING WEREWOLVES");
        var curLobbyState = lobbyState;
        var newMsg = "Werewolves, wake up and look for other werewolves";
        var newroleAction = '';
        curLobbyState.log.push({ msg: newMsg });
        for (var i = 0; i < lobbyState.playerList.length; i++) {
            if (lobbyState.playerList[i].role == 'werewolf') {

                if (lobbyState.playerList[i].nickname == playerState.nickname) {
                    isWolf = true;
                } else {
                    wolves.push(lobbyState.playerList[i].nickname + ": is a werewolf \n");
                }
            }
        }
        //console.log("WOLVES: " , wolves);
        //console.log("PLAYER ROLE: ", isWolf);
        if (isWolf) {
            for (var i = 0; i < wolves.length; i++) {
                newroleAction += wolves[i];
            }
            if (wolves.length == 1) {
                setRoleAction("No other WereWolves")
            } else {
                setRoleAction(newroleAction);
            }
        }
        //console.log("roleAction: " , roleAction);

        if (lobbyState.wolfGameState.midCards.includes("seer")) {
            if (lobbyState.wolfGameState.midCards.includes("robber")) {
                if (lobbyState.wolfGameState.midCards.includes("troublemaker")) {
                    curLobbyState.wolfGameState.playerTurn = 4;
                } else {
                    curLobbyState.wolfGameState.playerTurn = 3;
                }

            } else {
                curLobbyState.wolfGameState.playerTurn = 2;
            }

        } else {
            curLobbyState.wolfGameState.playerTurn = 1; //seer turn = true
        }
        socket.emit("update_lobby_state", curLobbyState);
    }

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function seePlayercard() {
        //console.log("See player card ran  --------------------------");
        setisSeeing(true);
    }



    const handleSeerSubmit = event => {
        event.preventDefault();
        //console.log("message is -----------------" + msg);
        var seeRole = 'player not found';
        for (var i = 0; i < lobbyState.playerList.length; i++) {
            if (lobbyState.playerList[i].nickname == msg) {
                seeRole = "player " + lobbyState.playerList[i].nickname + " \'s card is " + lobbyState.playerList[i].role;
            }
        }
        setRoleAction(seeRole);
        var curLobbyState = lobbyState;
        if (lobbyState.wolfGameState.midCards.includes("robber")) {
            if (lobbyState.wolfGameState.midCards.includes("troublemaker")) {
                curLobbyState.wolfGameState.playerTurn = 4;
            } else {
                curLobbyState.wolfGameState.playerTurn = 3;
            }
        } else {
            curLobbyState.wolfGameState.playerTurn = 2;
        }

        socket.emit("update_lobby_state", curLobbyState);
        setisSeeing(false);
    }

    const handleRobSubmit = event => {
        event.preventDefault();
        //console.log("message is -----------------" + msg);
        var seeRole = 'player not found';

        var tIndex = 0;

        for (var i = 0; i < lobbyState.playerList.length; i++) {
            //console.log("uindex" + uIndex);
            if (lobbyState.playerList[i].nickname == msg) {
                const temp = lobbyState.playerList[uIndex].role;
                //console.log("TEMP ----------- " + temp);
                lobbyState.playerList[uIndex].role = lobbyState.playerList[i].role;
                //console.log("uIndex----------- " + lobbyState.playerList[uIndex].role);
                lobbyState.playerList[i].role = temp;
                seeRole = 'you have switched cards';
            }
        }
        setRoleAction(seeRole);
        var curLobbyState = lobbyState;

        if (lobbyState.wolfGameState.midCards.includes("troublemaker")) {
            curLobbyState.wolfGameState.playerTurn = 4;
        } else {
            curLobbyState.wolfGameState.playerTurn = 3;
        }


        socket.emit("update_lobby_state", lobbyState);
    }

    function seeMidCard() {
        var midSeer = '';
        //console.log("WOLF GAME STATE" + lobbyState.wolfGameState.midCards);
        var midCards = lobbyState.wolfGameState.midCards;
        //console.log("midcards in seer: " + midCards);

        midSeer += "two cards from the middle are: ";
        midSeer += midCards[0] + "\n";
        midSeer += midCards[1] + "\n";
        //console.log("midseer: " + midSeer);
        setRoleAction(midSeer);
        var curLobbyState = lobbyState;
        if (lobbyState.wolfGameState.midCards.includes("robber")) {
            if (lobbyState.wolfGameState.midCards.includes("troublemaker")) {
                curLobbyState.wolfGameState.playerTurn = 4;
            } else {
                curLobbyState.wolfGameState.playerTurn = 3;
            }
        } else {
            curLobbyState.wolfGameState.playerTurn = 2;
        }


        socket.emit("update_lobby_state", curLobbyState);
        setisSeeing(false);
    }

    const handleVote = event => {
        event.preventDefault();
        //console.log("message is -----------------" + msg);
        var seeRole = 'player not found';

        setRoleAction(seeRole);
        var curLobbyState = lobbyState;
        curLobbyState.wolfGameState.votes.push(msg)
        socket.emit("update_lobby_state", curLobbyState);

        if (curLobbyState.wolfGameState.votes.length >= numPlayers) {
            const counts = {};
            var arr = lobbyState.wolfGameState.votes;
            // Loop through the array and count the number of occurrences of each value
            for (const value of arr) {
                counts[value] = (counts[value] || 0) + 1;
            }

            // Find the most common value
            let mostCommonValue;
            let highestCount = 0;
            for (const value in counts) {
                if (counts[value] > highestCount) {
                    highestCount = counts[value];
                    mostCommonValue = value;
                }
            }

            seeRole = mostCommonValue + " HAS BEEN KILLED!"
            setRoleAction(seeRole);
            curLobbyState.wolfGameState.playerTurn = 5;
            socket.emit("update_lobby_state", curLobbyState);
        }
    }

    const handleTrblSubmit = event => {
        event.preventDefault();
        //console.log("message is -----------------" + msg);
        var seeRole = 'player not found';
        const names = msg.split(",");

        var t1 = names[0];
        var t2 = names[1];

        var t1ind = -1;
        var t2ind = -1;

        for (var i = 0; i < lobbyState.playerList.length; i++) {
            if (lobbyState.playerList[i].nickname == t1) {
                t1ind = i;
            }
            if (lobbyState.playerList[i].nickname == t2) {
                t2ind = i;
            }
        }
        if (t1ind !== -1 && t2ind !== -1) {
            seeRole = 'Players cards have been switched';
        }

        const temp = lobbyState.playerList[t1ind].role;
        lobbyState.playerList[t1ind].role = lobbyState.playerList[t2ind].role;
        lobbyState.playerList[t2ind].role = temp;

        setRoleAction(seeRole);
        lobbyState.wolfGameState.playerTurn = 4;
        socket.emit("update_lobby_state", lobbyState);
    }



    function Settings() {
        // Initialize stuff
        const isHost = useSelector((state) => state.playerState.host);


        return (
            <div >
                {isHost && <>
                    <div>
                        <button type="button" onClick={startGame}>Start Game</button>
                    </div>
                </>}
                {!isHost && <>
                    <div>
                        <h2>Waiting for host to start the game</h2>
                    </div>
                </>}
            </div>

        );
    }

    return (
        <div>
            {!gameStart && <>
                <Settings />
            </>
            }
            {gameStart && <>
                <div>
                    GAME STARTED
                    {isRob && <>
                        <h1>your role is {lobbyState.playerList[uIndex].role}</h1>
                    </>}
                    {!isRob && <>
                        <h1>your role is {playerState.role}</h1>
                    </>}
                    <h1>{roleAction}</h1>
                    {seerTurn && isSeer && <>
                        <button type="button" onClick={seePlayercard}>See player card</button>
                        <button type="button" onClick={seeMidCard}>See two cards from middle</button>
                    </>}
                    {isSeeing && <>
                        <form onSubmit={handleSeerSubmit}>
                            <div >
                                <h1>Type name of player whos card you want to see.</h1>
                                <hr></hr>
                                <input className='textBox' value={msg} type="text" placeholder="message" onChange={(e) => setMsg(e.target.value)} />
                                <button className='myB' type='submit'>send</button>
                            </div>
                        </form>
                    </>}
                    {isRob && robTurn && <>
                        <form onSubmit={handleRobSubmit}>
                            <div >
                                <h1>Type name of player whos card you want to switch with.</h1>
                                <hr></hr>
                                <input className='textBox' value={msg} type="text" placeholder="message" onChange={(e) => setMsg(e.target.value)} />
                                <button className='myB' type='submit'>send</button>
                            </div>
                        </form>
                    </>}
                    {isTrbl && trblTurn && <>
                        <form onSubmit={handleTrblSubmit}>
                            <div >
                                <h1>Type the names of the two players cards to switch in "name,name" format.</h1>
                                <hr></hr>
                                <input className='textBox' value={msg} type="text" placeholder="message" onChange={(e) => setMsg(e.target.value)} />
                                <button className='myB' type='submit'>send</button>
                            </div>
                        </form>
                    </>}
                    {dayTurn && <>
                        <form onSubmit={handleVote}>
                            <div >
                                <h1>You have made it through the night and it has turned to day! Please cast vote for a user with the box below</h1>
                                <hr></hr>
                                <input className='textBox' value={msg} type="text" placeholder="message" onChange={(e) => setMsg(e.target.value)} />
                                <button className='myB' type='submit'>send</button>
                            </div>
                        </form>
                    </>}
                </div>
            </>
            }

        </div>
    );

}

export default WerewolfContainer;