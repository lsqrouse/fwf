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
  const playerState = useSelector((state: any) => state.playerState);

  console.log("lobby state is, ", lobbyState)

  const dispatch = useDispatch();

  const colDefs = [
    {field: 'nickname'}
  ]

  if (!joined && lobbyState.lobbyId != undefined) {
      var join_data = {
        lobbyId: lobbyState.lobbyId,
        host: playerState.host,
        nickname: playerState.nickname
      }  
      socket.emit("join_lobby", join_data)
      console.log("joined lobby ", join_data)
      setJoined(true)
  }

  useEffect(() => {
      socket.on("receive_lobby_state", (data) => {
          console.log("Recieved updated lobby state from server: ", data)
          var newLobbyState = data;
          dispatch({type: 'updateLobby', payload: newLobbyState})
        });
        
      socket.on("recieve_player_state", (data) => {
          console.log("Recieved updated player state from server: ", data)
          var newPlayerState = data;
          dispatch({type: 'updatePlayer', payload: newPlayerState})
      });  
    
  }, [socket])

  const handleGameChoice = (game: string) => {
    var curLobbyState = lobbyState;
    curLobbyState.game = game;
    console.log("Updating Lobby State to: ", curLobbyState)
    socket.emit("update_lobby_state", curLobbyState);
  }

  // If just player return player screen
  if (playerState.host == false)
  {
    return (
      <>
      <div className='titleBox'>
        <h1>Welcome {playerState.nickname}! <br/> Game: {lobbyState.gameState.game} <br/> Lobby Code: {lobbyState.lobbyId}</h1>
      </div>
      <div className='outerBox'>
        <div className='middle'>
          <div className='chat'>Players
            <div style={{width: "100%", height: "90%", marginTop: '10%'}}>
              <AgGridReact
                rowData={lobbyState.playerList}
                columnDefs={colDefs}>
            </AgGridReact>
            </div>
          </div>
          <div className='playerScreen'>
            <h1>Your Role is: <br/> {playerState.Role} </h1>
            <br/>
            <div>
              <button onClick={() => {alert("if role == roletype then do role action")}}> Do Role Action </button>
            </div>
            <br/>
            <div>
              <button onClick={() => {alert("if role == mafia then show mafia list")}}> View Mafia List </button>
            </div>
          </div>
          <div className='chat'>chat
            
          </div>
        </div>

        <div className='ag-theme-alpine' style={{height: 75, width: 100}}>
      </div>
      </div>
    </>
    )
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
        <h1>Welcome to Fun With Friends, {playerState.nickname}. <br/> Invite friends to play with code {lobbyState.lobbyId}</h1>
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
            
            <div style={{width: "100%", height: "90%", marginTop: '10%'}}>
              {/* <form onSubmit={this.handleSubmit}>
                <div id='chatBox'>
                  <hr></hr>
                  <input className='textBox' type="text" placeholder="UserName" onChange={(e) => this.setState({ msg: e.target.value })} />
                  <button className='myB' type='submit'>Invite</button>
                </div>
              </form> */}
              <AgGridReact
                rowData={lobbyState.playerList}
                columnDefs={colDefs}>
            </AgGridReact>
            </div>
          </div>
          <div className='screen'>
            <Game game={lobbyState.game} socket={socket}/>
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