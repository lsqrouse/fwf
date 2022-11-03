import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainLobby.css';
import Game from './pages/game';
import { AgGridReact } from 'ag-grid-react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import TextLog from './textLog.jsx';
import { json } from 'stream/consumers';


const socket = io("http://localhost:3001").connect()

// @ts-ignore
export default function MainLobby() {
  const [joined, setJoined] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>('');
  // const [lobbyState, setLobbyState] = useState<any>(useSelector((state: any) => state.lobbyState));
  const lobbyState = useSelector((state: any) => state.lobbyState);
  const playerState = useSelector((state: any) => state.playerState);

  console.log("lobby state is, ", lobbyState)

  const dispatch = useDispatch();

  const colDefs = [
    { field: 'nickname' }
  ]
  const chatColDefs = [
    { field: 'msg' }
  ]
  console.log("joined %b", joined)
  console.log("host is ", lobbyState.lobbyHost)
  console.log("i am ", playerState.id, " comp is ", playerState.id == lobbyState.lobbyHost)
  if (!joined && lobbyState.lobbyId != undefined) {
    var join_data = {
      lobbyId: lobbyState.lobbyId,
      host: playerState.host,
      nickname: playerState.nickname,
      gamePlayerState: playerState.gamePlayerState
    }
    var rejoin = false;
    for (var i = 0; i < lobbyState.playerList.length; i++) {
      console.log(lobbyState.playerList[i].nickname);
      if (lobbyState.playerList[i].nickname == join_data.nickname) {
        console.log("BREAKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")
        rejoin = true;
        break;
      }
    }
    if (!rejoin) {
      socket.emit("join_lobby", join_data)
      console.log("joined lobby ", join_data)
      setJoined(true)
    }

  }

  useEffect(() => {
    socket.on("receive_lobby_state", (data) => {
      console.log("Recieved updated lobby state from server: ", data)
      var newLobbyState = data;
      dispatch({ type: 'updateLobby', payload: newLobbyState })
    });

    socket.on("recieve_player_state", (data) => {
      console.log("Recieved updated player state from server: ", data)
      var newPlayerState = data;
      dispatch({ type: 'updatePlayer', payload: newPlayerState })
    });

  }, [socket])


  const handleLeave = () => {

    var curLobbyState = lobbyState;
    setJoined(false)
    dispatch({ type: 'updateLobby', payload: { gameState: {} } })
    console.log("disconnecting: ");

    if (window.confirm("Are you sure you want to leave the lobby?")) {
      var curLobbyState = lobbyState;
      setJoined(false)
      dispatch({ type: 'updateLobby', payload: { gameState: {} } })
      console.log("disconnecting: ");
    }

  }
  const handleChatSubmit = event => {
    event.preventDefault();
    var curLobbyState = lobbyState;
    console.log("Updating Lobby State to: ", curLobbyState)
    var newMsg = playerState.nickname + ": " + msg;
    curLobbyState.chatLog.push({ msg: newMsg });
    console.log("CHECKING THE STATE POST EMIT FOR FORM SUBMIT ", curLobbyState);
    socket.emit("update_lobby_state", curLobbyState);
    refreshChat();
  }

  const refreshChat = () => {
    setMsg('');
  }

  const handleGameChoice = (game: string) => {
    var curLobbyState = lobbyState;
    curLobbyState.game = game;
    console.log("Updating Lobby State to: ", curLobbyState)
    socket.emit("update_lobby_state", curLobbyState);
  }

  const handleFramerTarget = (name: string) => {
    var curLobbyState = lobbyState;
    curLobbyState.gameState.framerTarget = name;
    console.log("Updating Lobby State Framer Target to: ", curLobbyState)
    socket.emit("update_lobby_state", curLobbyState);
  }

  const handleRessurectionistTarget = (name: string) => {
    var curLobbyState = lobbyState;
    curLobbyState.gameState.ressurectionistTarget = name;
    console.log("Updating Lobby State Ressurectionist Target to: ", curLobbyState)
    socket.emit("update_lobby_state", curLobbyState);
  }

  const handleExecutionerTarget = (name: string) => {
    var curLobbyState = lobbyState;
    curLobbyState.gameState.executionerTarget = name;
    console.log("Updating Lobby State Ressurectionist Target to: ", curLobbyState)
    socket.emit("update_lobby_state", curLobbyState);
  }

  // If just player return player screen
  console.log(playerState.host == false)
  console.log(playerState.id != lobbyState.lobbyHost)
  var result = [''];
  
  //console.log(lobbyState.chatLog.length, "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
  if (lobbyState.chatLog != undefined)
    for (var i = 0; i < lobbyState.chatLog.length; i++) {
      result.push(lobbyState.chatLog[i].msg);
    }
  
  const listItems = result.map((msg) =>
    <li>{msg}</li>
  );
  var logs = [''];
  //console.log(lobbyState.log, "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
  if (lobbyState.log != undefined) {
    for (var i = 0; i < lobbyState.log.length; i++) {
      logs.push(lobbyState.log[i].msg);
    }
  }
  //console.log(logs, "ASFASFASFASFFFFFFFFFFFFFFFFFFFFFF");
  const logItems = logs.map((msg) =>
    <li>{msg}</li>
  );

  if (playerState.id != lobbyState.lobbyHost) {
    return (
      <>
        <div className="login">
          <Link to="/">
            <button className='myButton' onClick={handleLeave}>Back</button>
          </Link>
          <Link to="/Instructions">
            <button className='myButton' onClick={() => setJoined(true)}>Instructions</button>
          </Link>
        </div>
        <div className='titleBox'>
          <h1>Welcome {playerState.nickname}! <br /> Game: {lobbyState.gameState.game} <br /> Lobby Code: {lobbyState.lobbyId}</h1>
        </div>
        <div className='outerBox'>
          <div className='middle'>
            <div className='chat'>Players
              <div style={{ width: "100%", height: "90%", marginTop: '10%' }}>
                <AgGridReact
                  rowData={lobbyState.playerList}
                  columnDefs={colDefs}>
                </AgGridReact>
              </div>
            </div>
            <div className='playerScreen'>
              <Game
                game={lobbyState.game}
                code={lobbyState.lobbyId}
                socket={socket}
                handleLeave={handleLeave}
              />
            </div>
            <div className='chat'>

              <ul>{listItems}</ul>
              <form onSubmit={handleChatSubmit}>
                <div id='chatBox'>
                  <hr></hr>
                  <input className='textBox' value={msg} type="text" placeholder="message" onChange={(e) => setMsg(e.target.value)} />
                  <button className='myB' type='submit'>send</button>
                </div>
              </form>

            </div>
          </div>

          
            <div className="box">log
              <ul>{logItems}</ul>
            </div>
          
        </div>
      </>
    )
  }

  return (
    <>
      <div className="login">
        <Link to="/">
          <button className='myButton' onClick={handleLeave}>Back</button>
        </Link>
        <Link to="/Instructions">
          <button className='myButton'>Instructions</button>
        </Link>
      </div>
      <div className='titleBox'>
        <h1>Welcome to Fun With Friends, {playerState.nickname}. <br /> Invite friends to play with code {lobbyState.lobbyId}</h1>
      </div>
      <div className='outerBox'>
        <div className='navBar'>
          {/* <Link to="/Mafia"> */}
          <button className='myBMaf' type='submit' onClick={() => { handleGameChoice('Mafia') }}>Mafia
            <p className='descMaf'>A game of mystery and deciption that pins citizens against mafia to see who will rule the town.</p>
          </button>
          {/* </Link> */}

          <button className='myBMaf' type='submit' onClick={() => { handleGameChoice('avalon') }}>AVALON
            <p className='descMaf'>HELLO THIS IS AVALON BABY hi</p>
          </button>
          <button className='myBMaf' onClick={() => { handleGameChoice('Werewolf') }}>WEREWOLF
            <p className='descMaf'>HELLO THIS IS WEREWOLF BABY hi</p>
          </button>
          <button className='myBMaf' type='submit' onClick={() => { handleGameChoice('ghost') }}>GHOST
            <p className='descMaf'>HELLO THIS IS GHOST BABY hi</p>
          </button>
          <button className='myBMaf' type='submit' onClick={() => { handleGameChoice('fake artist') }}>FAKE ARTIST
            <p className='descMaf'>HELLO THIS IS FAKE ARTIST BABY hi</p>
          </button>
          <button className='myBMaf' type='submit' onClick={() => { handleGameChoice('coup') }}>COUP
            <p className='descMaf'>HELLO THIS IS COUP BABY hi</p>
          </button>
        </div>
        <div className='middle'>
          <div className='chat'>Players:

            <div style={{ width: "100%", height: "90%", marginTop: '10%' }}>
              <AgGridReact
                rowData={lobbyState.playerList}
                columnDefs={colDefs}>
              </AgGridReact>
            </div>
          </div>
          <div className='screen'>
            <Game
              game={lobbyState.game}
              code={lobbyState.lobbyId}
              socket={socket}
              handleLeave={handleLeave}
            />
          </div>
          <div className='chat'>
            <hr id='chatBox'></hr>
            <div >



              <ul>{listItems}</ul>
              <form onSubmit={handleChatSubmit}>
                <div id='chatBox'>
                  <hr></hr>
                  <input className='textBox' value={msg} type="text" placeholder="message" onChange={(e) => setMsg(e.target.value)} />
                  <button className='myB' type='submit'>send</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="box">log
          <ul>{logItems}</ul>
        </div>
        <div className='ag-theme-alpine' style={{ height: 400, width: 600 }}>
        </div>
      </div>
    </>

  )

}