import { useState } from "react";
import { useSelector } from "react-redux";


function WerewolfContainer(props) {
    console.log("LOADED WEREWOLF");

    const numPlayers = useSelector((state) => state.lobbyState.playerList).length;
    //const gameScreen = useSelector((state) => state.lobbyState.gameState.gameScreen);
    const playerState = useSelector((state) => state.playerState);
    const socket = props.socket;
    const lobbyState = useSelector((state) => state.lobbyState);
    const [warnMessage, setWarnMessage] = useState("");
    var gameStart = false || lobbyState.wolfGameState.gameStarted;
    var seerTurn = false || lobbyState.wolfGameState.playerTurn == 1;
    console.log('GAME STARTED STATE', gameStart);
    const [roleAction, setRoleAction] = useState("");
    const [isSeeing, setisSeeing] = useState(false);
    const [msg, setMsg] = useState('');
    var wolves = [''];
    var isWolf = false || playerState.role == "werewolf";
    //const [isSeer, setisSeer] = useState(false || playerState.role == "seer");
    var isSeer = false || playerState.role == "seer";
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
    if (gameStart && !seerTurn) {
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
        curLobbyState.wolfGameState.playerTurn = 1; //seer turn = true
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
        console.log("See player card ran  --------------------------");
        setisSeeing(true);
    }

    

    const handleSeerSubmit = event => {
        event.preventDefault();
        console.log("message is -----------------" + msg);
        var seeRole = 'player not found';
        for (var i = 0; i < lobbyState.playerList.length; i++) {
            if (lobbyState.playerList[i].nickname == msg) {
                seeRole = "player " + lobbyState.playerList[i].nickname + " \'s card is " + lobbyState.playerList[i].role;
            }
        }
        setRoleAction(seeRole);
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
        curLobbyState.wolfGameState.playerTurn = 2;
        socket.emit("update_lobby_state", curLobbyState);
        setisSeeing(false);
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
                    <h1>your role is {playerState.role}</h1>
                    <h1>{roleAction}</h1>
                    {seerTurn && isSeer && <>
                        <button type="button" onClick={seePlayercard}>See player card</button>
                        <button type="button" onClick={seeMidCard}>See two cards from middle</button>
                    </>}
                    {isSeeing && <>
                        <form onSubmit={handleSeerSubmit}>
                            <div >
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