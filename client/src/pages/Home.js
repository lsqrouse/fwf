import React, {useState} from 'react';

export default function Home() {
    const [nickname, setNickname] = useState("");
    const [lobby, setLobby] = useState("");

    const joinLobby = () => {
        
    } 
    return (
        <>      
        <div >
        <h1>{`<>DevRooms</>`}</h1>
        <input placeholder='Username...'  />
        <input placeholder='Lobby...'  />
        <button onClick={joinLobby} >Join Room</button>
      </div></>
    )
}