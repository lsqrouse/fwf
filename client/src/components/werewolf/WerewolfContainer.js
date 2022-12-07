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
    var wolves = [''];
    var isWolf = false || playerState.role == "werewolf";
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
            roles.push("werewolf");
        } else if (numPlayers == 5) {
            roles.push("werewolf");
            roles.push("werewolf");
        } else if (numPlayers > 5){
            alert("Too many players");
            return;
        }

        roles = shuffle(roles);

        if (lobbyState.playerList != undefined) {
            if (roles.length != lobbyState.playerList.length) {
                console.log("ROLE AND PLAYER LENGTH DO NOT MATCH");
            }

            for (var i = 0; i < lobbyState.playerList.length; i++) {
                lobbyState.playerList[i].role = roles[i];
                lobbyState.playerList[i].name = playerState.nickname;
            }
            socket.emit("start_wolf_game", lobbyState);
        }

    }
    console.log("SEER TURN: ", seerTurn);
    if (gameStart && !seerTurn) {
        console.log("SHOWING WEREWOLVES");
        var curLobbyState = lobbyState;
        var newMsg = "Werewolves, wake up and look for other werewolves";
        var newroleAction = '';
        curLobbyState.log.push({ msg: newMsg });
        for (var i = 0; i < lobbyState.playerList.length; i++) {
            if(lobbyState.playerList[i].role == 'werewolf') {
                
                if(lobbyState.playerList[i].nickname == playerState.nickname) {
                    isWolf = true;
                }else {
                    wolves.push(lobbyState.playerList[i].nickname + ": is a werewolf \n");
                }
            }
        }
        //console.log("WOLVES: " , wolves);
        //console.log("PLAYER ROLE: ", isWolf);
        if (isWolf) {
            for(var i = 0; i < wolves.length; i++){
                newroleAction += wolves[i]; 
            }
            if(wolves.length == 1){
                setRoleAction("No other WereWolves")
            }else{
                setRoleAction(newroleAction);
            }
        }
        //console.log("roleAction: " , roleAction);
        curLobbyState.wolfGameState.playerTurn = 1;
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
                </div>
            </>
            }

        </div>
    );

}

export default WerewolfContainer;