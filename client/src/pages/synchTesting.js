import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import TestGame from './TestGame';

const socket = io.connect("http://localhost:3001")

export default function SyncTesting() {
    const [num, setNum] = useState(0);
    const [gameState, setGameState] = useState({lobbyId: 'ABC', gameState: {}})
    const [playerList, setPlayerList] = useState([]);
    const [joined, setJoined] = useState(false);

    console.log(socket);

    const increaseNum = () => {
        socket.emit("send_num", {number: num})
    }

    const updateState = () => {
        socket.emit("send_state", gameState)
    } 

    useEffect(() => {
        socket.on("receive_num", (data) => {
            console.log(data)
            setNum(data["number"])
        });
        
        socket.on("recieve_state", (data) => {
            console.log("Game state updated to ", data)
            setGameState(data)
        });

        socket.on("players", (data) => {
            console.log("Players updated")
            console.log(data)
            setPlayerList(data)
        })
        
    }, [socket])

    if (!joined) {
        socket.emit("join_lobby", gameState.lobbyId)
        setJoined(true)
    }

    return (<div>
        <h1> This is a test to see if something changes : {num} </h1>
        <br/>
        <input placeholder='Message...'></input>
        <button onClick={increaseNum} > Increase Num</button>

        <TestGame lobbyId={gameState.lobbyId} playerList={playerList}/>
    </ div>)
}

