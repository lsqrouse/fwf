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
    console.log('GAME STARTED STATE', gameStart);
    
      
    const minPlayers = 3;
    var roles = ["werewolf", "werewolf", "seer", "robber", "troublemaker", "villager"]; //load in roles alternative way here


    function startGame() {
        console.log('starting werewolf');
        console.log('PLAYER STATE', playerState);
        console.log('LOBBY STATE', lobbyState);
        if (numPlayers <= 2) {
            alert("not enough players");
            return;
        } else if (numPlayers == 4) {
            roles.push("villager");
        } else if (numPlayers == 5) {
            roles.push("villager");
            roles.push("villager");
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
                </div>
            </>
            }

        </div>
    );

}

export default WerewolfContainer;