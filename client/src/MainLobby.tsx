import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainLobby.css';
import Game from './pages/game';
import { AgGridReact } from 'ag-grid-react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import TextLog from './textLog.jsx';

const socket = io("http://localhost:3001").connect()

// @ts-ignore
export default function MainLobby() {
  const [joined, setJoined] = useState<boolean>(false);
  // const [lobbyState, setLobbyState] = useState<any>(useSelector((state: any) => state.lobbyState));
  const lobbyState = useSelector((state: any) => state.lobbyState);
  console.log("lobby state is, ", lobbyState)

  const dispatch = useDispatch();

  // state = {
  //   log: ['hello and welcome', "hello"],
  //   msg: "",
  //   game: "None",
  //   name: "Name",
  //   serverInfo: {playerList: []}
  // }

  const colDefs = [
    {field: 'id'}
  ]

  if (!joined && lobbyState.lobbyId != undefined) {
      socket.emit("join_lobby", lobbyState.lobbyId)
      console.log("joined lobby ", lobbyState.lobbyId)
      setJoined(true)
  }

  useEffect(() => {
      socket.on("receive_lobby_state", (data) => {
          console.log("Recieved update from server: ", data)
          var newLobbyState = data;
          dispatch({type: 'updateLobby', payload: newLobbyState})
        }); 
    
  }, [socket])

  const handleGameChoice = (game: string) => {
    console.log("handling game choice update to ", game)
    var curLobbyState = lobbyState;
    curLobbyState.game = game;
    console.log("updating state to ", curLobbyState)
    socket.emit("update_lobby_state", curLobbyState);
  }

  return (
    <>
      <div className="login">
        <Link to="/">
          <button className='myButton'>Back</button>
        </Link>
        <Link to="/Instructions">
          <button className='myButton'>Instructions</button>
        </Link>
      </div>
      <div className='titleBox'>
        <h1>Fun With Friends</h1>
      </div>
      <div className='outerBox'>
        <div className='navBar'>
          {/* <Link to="/Mafia"> */}
            <button className='myBMaf' type='submit' onClick={() => {handleGameChoice('Mafia')}}>Mafia
              <p className='descMaf'>HELLO THIS IS MAFIA BABY hi</p>
            </button>
          {/* </Link> */}

          <button className='myB' type='submit'>Game2</button>
          <button className='myB' type='submit'>Game3</button>
          <button className='myB' type='submit'>Game4</button>
        </div>
        <div className='middle'>
          <div className='chat'>Players

            <div>
              {/* <form onSubmit={this.handleSubmit}>
                <div id='chatBox'>
                  <hr></hr>
                  <input className='textBox' type="text" placeholder="UserName" onChange={(e) => this.setState({ msg: e.target.value })} />
                  <button className='myB' type='submit'>Invite</button>
                </div>
              </form> */}
            </div>
          </div>
          <div className='screen'>
            <Game game={lobbyState.game} />
          </div>
          <div className='chat'>chat
            <ul className="list-group">
              {/* {this.state.log.map(listitem => (
                <li key={listitem}>
                  {listitem}
                </li>
              ))} */}
            </ul>
            <div>
              {/* <form onSubmit={this.handleSubmit}>

                <div id='chatBox'>
                  <hr></hr>
                  <input className='textBox' type="text" placeholder="type message" onChange={(e) => this.setState({ msg: e.target.value })} />
                  <button className='myB' type='submit'>send</button>
                </div>

              </form> */}
            </div>
          </div>
        </div>

        <div className="box">log</div>
        <div className='ag-theme-alpine' style={{height: 400, width: 600}}>
      </div>
      </div>
    </>

  )

}