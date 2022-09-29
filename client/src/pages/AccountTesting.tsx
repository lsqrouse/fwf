import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import TestGame from './TestGame';

export default function AccountTesting() {
    const [data, setData] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const login = () => {
        fetch(`/api/login?username=${username}&password=${password}`)
        .then((res) => res.json())
        .then((data) => setData(data.message))
    }
    return <>
        
    </>
}