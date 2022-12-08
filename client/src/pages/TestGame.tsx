import { AgGridReact } from 'ag-grid-react';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

const socket = io("http://localhost:8080").connect()

type testGameProps = {
    lobbyId: string,
};

type gameState = {
    lobbyId: string,
    whoseTurn: string,
    counter: number,
    playerList: Array<JSON>,
    lobbyHost: string,
}

type playerState = {
    id: string,
    lobbyId: string,
    gameState: {
        role: string
    }
}

export default function TestGame(props: testGameProps) {
    const [joined, setJoined] = useState<boolean>(false);
    const [gameState, setGameState] = useState<any>({});
    const [playerState, setPlayerState] = useState<any>({});

    const colDefs = [
        {field: 'id'}
    ]

    if (!joined) {
        console.log("joining lobby")
        socket.emit("join_lobby", props.lobbyId)
        setJoined(true)
    }

    useEffect(() => {
        socket.on("recieve_game_state", (data) => {
            console.log("Game state updated to ", data)
            var newGameState = data;
            setGameState(newGameState)
        }); 

        socket.on("recieve_player_state", (data) => {
            console.log("new player data", data)
            var newPlayerState = data
            setPlayerState(newPlayerState)
        })      
    }, [socket])

    const takeTurn = () => {
        gameState.counter+=1
        socket.emit("update_game_state", gameState)
    }
    console.log("Current game state: ", gameState)
    return (
        <>
        <h1>hello world, game is this {props.lobbyId}, hosted by: {gameState.lobbyHost}, <br/> You are: {playerState.id} <br></br> players are currently:</h1>
        <button onClick={takeTurn}> Take your turn </button>
        <div className='ag-theme-alpine' style={{height: 400, width: 600}}>
           <AgGridReact
               rowData={gameState.playerList}
               columnDefs={colDefs}>
           </AgGridReact>
       </div>
       <br/>
        {gameState.counter} is the current value of hte counter
               </>
    );
}