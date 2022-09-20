import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import Messages from '../Messages';
import MessageInput from '../MessageInput';
const socket = io.connect("http://localhost:3001")

export default function SyncTesting() {
    const [num, setNum] = useState(0);

    console.log(socket);

    const increaseNum = () => {
        socket.emit("send_num", {number: num})
    }

    useEffect(() => {
        socket.on("receive_num", (data) => {
            console.log(data)
            setNum(data["number"])
        })

    }, [socket])

    return (<div>
        <h> This is a test to see if something changes : {num} </h>
        <br/>
        <input placeholder='Message...'></input>
        <button onClick={increaseNum} > Increase Num</button>
    </ div>)
}

