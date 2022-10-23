import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import TestGame from './TestGame';


export default function Account() {
    const userState = useSelector((state: any) => state.userState);
    const lobbyState = useSelector((state: any) => state.lobbyState);

    console.log("lobbystate", lobbyState)

    console.log("userstate is", userState)
    return <>
    {userState.token == undefined ? (<>
    {/* Page displayed when we have no token, and thus are not logged in */}
    <h1>You aren't logged in you bum.</h1>
    <Link to="/"></Link>
    </>) : (<>
    {/* Page displayed when we are logged in */}
    <h1>Hello There {userState.username}</h1>
    </>)}
    
    </>
}