import { useState } from "react";
import { useSelector } from "react-redux";


function WerewolfContainer(props) {
    console.log("LOADED WEREWOLF");

    const numPlayers = useSelector((state) => state.lobbyState.playerList).length;
    const gameScreen = useSelector((state) => state.lobbyState.gameState.gameScreen);
    const socket = props.socket;
    const lobbyState = useSelector((state) => state.lobbyState);
    const [warnMessage, setWarnMessage] = useState("");
    const minPlayers = 3;
    var roles = ["werewolf", "werewolf", "seer", "robber", "troublemaker", "villager"];
    if (numPlayers < 3) {
        alert("not enough players");
    }else if (numPlayers == 4) {
        roles.push("villager");
    }else if(numPlayers == 5){
        roles.push("villager");
        roles.push("villager");
    }else{
        alert("Too many players");
    }
    roles = shuffle(roles);
    
    

    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }
}