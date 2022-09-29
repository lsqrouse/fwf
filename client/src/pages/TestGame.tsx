import { AgGridReact } from 'ag-grid-react';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

const socket = io("http://localhost:3001").connect()

type testGameProps = {
    lobbyId: string,
};

type gameState = {
    whoseTurn: string
}

type myState = {
    id: string,
    role: string
}

export default function TestGame(props: testGameProps) {
    const [joined, setJoined] = useState<boolean>(false);
    const [playerList, setPlayerList] = useState<Array<any>>([]);
    const [gameState, setGameState] = useState<any>({});
    const [myState, setMyState] = useState<any>({});

    const colDefs = [
        {field: 'id'}
    ]

    if (!joined) {
        socket.emit("join_lobby", props.lobbyId)
        setJoined(true)
    }

    useEffect(() => {
        socket.on("recieve_state", (data) => {
            console.log("Game state updated to ", data)
            setGameState(data   )
        });

        socket.on("turn_update", (data) => {
            var newGameState = gameState;
            newGameState.whoseTurn = data;
            setGameState(newGameState)
        })

        socket.on("players", (data) => {
            console.log("new player data", data)
            setPlayerList(data)
        })
        
    }, [socket])

    const update = () => {
        socket.emit("update_state", gameState)
    }
    const takeTurn = () => {
        if (socket.id = gameState.whoseTurn) {
            socket.emit("turn_done", gameState)
        }
    }
    return (
        <>
        <h1>hello world, game is this {props.lobbyId}, currently player {gameState.whoseTurn}'s turn players are currently:</h1>
        <button onClick={takeTurn}> Take your turn </button>
        <div className='ag-theme-alpine' style={{height: 400, width: 600}}>
           <AgGridReact
               rowData={playerList}
               columnDefs={colDefs}>
           </AgGridReact>
       </div>        </>
    );
}