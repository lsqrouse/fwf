import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MainLobby.css';
import Game from './pages/game';
import { AgGridReact } from 'ag-grid-react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import TextLog from './textLog.jsx';
import { json } from 'stream/consumers';
import ActionBtnRenderer from './components/lobby/ActionBtnRenderer'

const socket = io("http://localhost:3001").connect()

// @ts-ignore
export default function MainLobby() {
  const [joined, setJoined] = useState<boolean>(false);
  const gridRef = useRef();
  const navigate = useNavigate();

  // const [lobbyState, setLobbyState] = useState<any>(useSelector((state: any) => state.lobbyState));
  const lobbyState = useSelector((state: any) => state.lobbyState);
  const playerState = useSelector((state: any) => state.playerState);

  const sizeToFit = () => {
    gridRef.current.api.sizeColumnsToFit({
      defaultMinWidth: 100,
      columnLimits: [{ key: 'country', minWidth: 900 }],
    });
  };
  console.log("lobby state is, ", lobbyState)

  const dispatch = useDispatch();

  const colDefs = [
    { field: 'nickname' },  

  ]
  if (playerState.id == lobbyState.lobbyHost) {
    colDefs.push(    {
      field: 'id',
      cellRenderer: ActionBtnRenderer,
      cellRendererParams: {
        clicked: function(field) {
          console.log("removing", {socketId: field, lobbyId: lobbyState.lobbyId})
          socket.emit('remove_player', {socketId: field, lobbyId: lobbyState.lobbyId});
        },
      },
    })
  }




  console.log("joined %b", joined)
  console.log("host is ", lobbyState.lobbyHost)
  console.log("i am ", playerState.id, " comp is ", playerState.id == lobbyState.lobbyHost)
  if (!joined && lobbyState.lobbyId != undefined) {
    var join_data = {
      lobbyId: lobbyState.lobbyId,
      host: playerState.host,
      nickname: playerState.nickname,
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
    for (var i =0; i < lobbyState.playerList.length; i++) {
      console.log(lobbyState.playerList[i].nickname);
      if(lobbyState.playerList[i].nickname == join_data.nickname) {
        console.log("BREAKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")
        rejoin = true;
        break;
      }
    }
    if(!rejoin){
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

    socket.on("removed_from_lobby", (data) => {
      console.log("ope, removed from this lobby")
      alert("You have been removed from this lobby.")
      navigate('/')
    })

  }, [socket])


  const handleLeave = () => {
    var curLobbyState = lobbyState;
    setJoined(false)
    dispatch({ type: 'updateLobby', payload: {}})
    console.log("disconnecting: ");
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
          <h1>Welcome {playerState.nickname}! <br /> Game: {lobbyState.game} <br /> Lobby Code: {lobbyState.lobbyId}</h1>
        </div>
        <div className='outerBox'>
          <div className='middle'>
            <div className='chat'>Players
              <div style={{height: 400, width: 600}}>
                <AgGridReact
                  rowData={lobbyState.playerList}
                  columnDefs={colDefs}
                  >
                </AgGridReact>
              </div>
            </div>
            <div className='playerScreen'>
              <Game game={lobbyState.game} socket={socket} host={playerState.host} hostName={lobbyState.lobbyHostName}/>
            </div>
            <div className='chat'>chat

            </div>
          </div>

          <div className='ag-theme-alpine' style={{ height: 75, width: 100 }}>
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
          <button className='myBMaf' type='submit' onClick={() => { handleGameChoice('Werewolf') }}>WEREWOLF
            <p className='descMaf'>HELLO THIS IS WEREWOLF BABY hi</p>
          </button>
          <button className='myBMaf' type='submit' onClick={() => { handleGameChoice('ghost') }}>GHOST
            <p className='descMaf'>HELLO THIS IS GHOST BABY hi</p>
          </button>
          <button className='myBMaf' type='submit' onClick={() => { handleGameChoice('fake artist') }}>FAKE ARTIST
            <p className='descMaf'>HELLO THIS IS FAKE ARTIST BABY hi</p>
          </button>
          <button className='myBMaf' type='submit' onClick={() => { handleGameChoice('Coup') }}>COUP
            <p className='descMaf'>Lie to your friends, take their coins, and win the game. May the best poker face win.</p>
          </button>
        </div>
        <div className='middle'>
          <div className='chat' style={{ }}>Players:
            <div className='grid-wrapper' style={{marginTop: '10%', marginLeft:'-30%'}}>
            <AgGridReact
                ref={gridRef}
                rowData={lobbyState.playerList}
                columnDefs={colDefs}
                onGridReady={sizeToFit}
               >
              </AgGridReact>
            </div>

              
          </div>
          <div className='screen'>
            <Game game={lobbyState.game} socket={socket} host={playerState.host}/>
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
        <div className='ag-theme-alpine' style={{ height: 400, width: 600 }}>
        </div>
      </div>
    </>

  )

}