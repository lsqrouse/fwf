import React, { useState, useEffect, useMemo} from 'react';
import { Link } from 'react-router-dom';
import './MainLobby.css';
import Game from './pages/Game.tsx';
import { AgGridReact } from 'ag-grid-react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import TextLog from './textLog.jsx';
import { json } from 'stream/consumers';
import Popup from 'reactjs-popup';
import { Container, Row, Col} from 'reactstrap';
//import 'reactjs-popup/dist/index';


const socket = io("http://localhost:3001").connect()

// @ts-ignore
export default function MainLobby() {
  const [joined, setJoined] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>('');
  // const [lobbyState, setLobbyState] = useState<any>(useSelector((state: any) => state.lobbyState));
  const lobbyState = useSelector((state: any) => state.lobbyState);
  const playerState = useSelector((state: any) => state.playerState);
  const userState = useSelector((state: any) => state.userState);


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
      gamePlayerState: playerState.gamePlayerState,
      isAlive: playerState.isAlive,
      role: playerState.role,
      card1: playerState.card1,
      card1Alive: playerState.card1Alive,
      card2: playerState.card2,
      card2Alive: playerState.card2Alive,
      numCoins: playerState.numCoins,
      numCards: playerState.numCards,
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
      //if we're logged in, find us in the player list and set the db id
      if (userState.token != "") {
        data.playerList.forEach((player) => {
          if (player.id == socket.id && player.db_id == "NONE") {
            console.log("found our player and it says we have no db_id")
            player.db_id = userState.userId
          }
        })
      }
      console.log("new lobby state of ", data)
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
      dispatch({ type: 'updateLobby', payload: {gameState: {}}})
      console.log("disconnecting: ");
    }

  }
  const handleChatSubmit = event => {
    event.preventDefault();
    var curLobbyState = lobbyState;
    console.log("Updating Lobby State to: ", curLobbyState)
    var newMsg = playerState.nickname + ": " + msg;
    curLobbyState.chatLog.push({ msg: newMsg });
    console.log("CHECKING THE STATE POST EMIT FOR FORM SUBMIT " , curLobbyState);
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
  console.log(lobbyState.chatLog, "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
  //console.log(lobbyState.chatLog.length, "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
  if(lobbyState.chatLog != undefined)
  for(var i = 0; i < lobbyState.chatLog.length; i++){
    result.push(lobbyState.chatLog[i].msg);
  }
  console.log(result, "ASFASFASFASFFFFFFFFFFFFFFFFFFFFFF");
  const listItems = result.map((msg) =>
    <li className='content'>{msg}</li>
  );

  console.log("stategame is ", lobbyState.game)


    return (
    <div className='pageContent'>
      <header className='header-area'>
      <Container style={{maxWidth:'100%', justifyContent:'center', }}>
      <Row style={{paddingBottom: '1%', paddingTop: '1%'}}>
      <Col className='col-2'>
        </Col>
          <Col className='col-2'>
            <Link to="/">
              <button className='second-button' onClick={handleLeave}>Back</button>
            </Link>
          </Col>
          <Col className='col-4 siteHeader'>
            <h1>Welcome {playerState.nickname}! <br />  Lobby Code: {lobbyState.lobbyId}</h1>
          </Col>
          <Col className='col-2'>
        </Col>
          <Col className='col-2'>
            <Link to="/Instructions">
              <button className='main-button' onClick={() => setJoined(true)}>Instructions</button>
            </Link>
          </Col>
        
        </Row>
        </Container>
        </header>
        <div className='pageContent'>
        
        {playerState.id == lobbyState.lobbyHost &&  lobbyState.game == "no game chosen" ? (<>
          <Container className='gameContainer' style={{maxWidth: '75%'}}>
        <Row style={{textAlign: 'center'}}>
          <Col>
          <h2>Please Choose a game:</h2>
          <div className='gameDesc'>
          <button className='second-button' type='submit' onClick={() => { handleGameChoice('Mafia') }}><h4>Mafia</h4>
            <p >TODO: insert mafia descr.</p>
          </button>
       
          <button className='second-button' type='submit' onClick={() => { handleGameChoice('Werewolf') }}><h4>Werewolf</h4>
            <p>TODO: insert werewolf desc.</p>
          </button>
         
            <button className='second-button' type='submit' onClick={() => { handleGameChoice('coup') }}><h4>Coup</h4>
            <p>TODO: insert coup descr.</p>
          </button>
          </div>
         
          </Col>
        </Row>
        </Container>

        </>) : (<></>)}
        <Container className='gameContainer' style={{maxWidth: '75%'}}>
        <Row>
          <Col className='col-2'>
          <div  >Players
            
            <div style={{width: '100%', height:lobbyState.playerList.length * 50 + 50 }} className="ag-theme-alpine">
              <AgGridReact
                rowData={lobbyState.playerList}
                columnDefs={colDefs}>
              </AgGridReact>
            </div>
          </div>
          </Col>
          <Col className='col-8'>
          <Game
                game={lobbyState.game}
                code={lobbyState.lobbyId}
                socket={socket}
                handleLeave={handleLeave}
              />
          </Col>
          <Col className='col-2'>
            <Popup trigger={<button>Open Chat</button>} position="left center">
                <ul>{listItems}</ul>
                  <form onSubmit={handleChatSubmit}>
                    <div id='chatBox'>
                      <hr></hr>
                      <input className='textBox' value={msg} type="text" placeholder="message" onChange={(e) => setMsg(e.target.value)} />
                      <button className='myB' type='submit'>send</button>
                    </div>
                  </form>
             </Popup>
          </Col>
        </Row>
        <Row> <p style={{visibility:'hidden'}}></p></Row>
        </Container>
        </div>
        
      </div>
  )

}