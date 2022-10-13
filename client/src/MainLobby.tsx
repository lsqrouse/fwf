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
  // const [lobbyState, setLobbyState] = useState<any>(useSelector((state: any) => state.lobbyState));
  const lobbyState = useSelector((state: any) => state.lobbyState);
  const playerState = useSelector((state: any) => state.playerState);

  console.log("lobby state is, ", lobbyState)

  const dispatch = useDispatch();

  const colDefs = [
    { field: 'nickname' }
  ]
  console.log("joined %b", joined)
  if (!joined && lobbyState.lobbyId != undefined) {
    var join_data = {
      lobbyId: lobbyState.lobbyId,
      host: playerState.host,
      nickname: playerState.nickname,
      isAlive: playerState.isAlive,
      role: playerState.role,
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
  if (playerState.host == false) {
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
              <h1>Your Role is: {playerState.Role} </h1>
              <br/>
              <h1>You Are Alive: {playerState.isAlive.toString()} </h1>
              <br/>
              <div>
                <button id="viewNightSummary" onClick={() => 
                {
                  console.log(playerState.host)
                  // Hide role action stuff
                  var hide1 = document.getElementById("frameName") as HTMLInputElement;
                  var hide2 = document.getElementById("frameButton") as HTMLInputElement;
                  var hide3 = document.getElementById("ressurectName") as HTMLInputElement;
                  var hide4 = document.getElementById("ressurectButton") as HTMLInputElement;
                  var hide5 = document.getElementById("executeName") as HTMLInputElement;
                  var hide6 = document.getElementById("executeButton") as HTMLInputElement;
                  hide1.style.display = "none"
                  hide2.style.display = "none"
                  hide3.style.display = "none"
                  hide4.style.display = "none"
                  hide5.style.display = "none"
                  hide6.style.display = "none"

                  // Get the modal and title
                  var modal = document.getElementById("myModal") as HTMLInputElement;
                  var modalTitle = document.getElementById("modalTitle") as HTMLInputElement;
                  modalTitle.innerHTML = "Night Summary"

                  // Get the button that opens the modal
                  var btn = document.getElementById("viewNightSummary") as HTMLInputElement;

                  // Get the <span> element that closes the modal
                  var span = document.getElementsByClassName("close")[0] as HTMLInputElement;

                  // Display night summary if available
                  var str = '<ul>'
                  // var list = lobbyState.gamesState.mafiaList;
                  // for (var i = 0; i < list.length; i++){
                  //   var player = list[i].nickname;
                  //   str += '<li>'+ player + '</li>';
                  //   str += '</ul>';
                  // }

                  // If night phase not started
                  if (lobbyState.gameState.nightPhaseStarted == false)
                  {
                    modalTitle.innerHTML = "Night Phase has not started yet"
                  }
                  // If night phase not ended
                  else if (lobbyState.gameState.nightPhaseStarted == true && lobbyState.gamesState.nightPhaseEnded == false)
                  {
                    modalTitle.innerHTML = "Night Phase has not ended yet"
                  }
                  // Else if ended
                  else if (lobbyState.gameState.nightPhaseStarted == true && lobbyState.gamesState.nightPhaseEnded == true)
                  {
                    str = "<h3>" + lobbyState.gameState.nightEventSummary + "</h3>"
                  }

                  var nameContainer = document.getElementById("nameContainer") as HTMLInputElement;
                  nameContainer.innerHTML = str;

                  // When the user clicks on the button, open the modal 
                  btn.onclick = function() {
                    modal.style.display = "block";
                  }

                  // When the user clicks on <span> (x), close the modal
                  span.onclick = function() {
                    modal.style.display = "none";
                  }

                  // When the user clicks anywhere outside of the modal, close it
                  window.onclick = function(event) {
                    if (event.target == modal) {
                      modal.style.display = "none";
                    }
                  }
                }} > View Night Summary </button>
              </div>
              <br/>
              <div>
                <button id="doRoleAction" onClick={() => 
                {
                  // UnHide role action stuff
                  var hide1 = document.getElementById("frameName") as HTMLInputElement;
                  var hide2 = document.getElementById("frameButton") as HTMLInputElement;
                  var hide3 = document.getElementById("ressurectName") as HTMLInputElement;
                  var hide4 = document.getElementById("ressurectButton") as HTMLInputElement;
                  var hide5 = document.getElementById("executeName") as HTMLInputElement;
                  var hide6 = document.getElementById("executeButton") as HTMLInputElement;
                  hide1.style.display = "block"
                  hide2.style.display = "block"
                  hide3.style.display = "block"
                  hide4.style.display = "block"
                  hide5.style.display = "block"
                  hide6.style.display = "block"

                  // Get the modal and title
                  var modal = document.getElementById("myModal") as HTMLInputElement;
                  var modalTitle = document.getElementById("modalTitle") as HTMLInputElement;
                  modalTitle.innerHTML = "Framers can choose a player to frame <br/> Ressurectionist can choose a dead player to revive <br/> Executioner can choose soemone to Execute"

                  // Get the button that opens the modal
                  var btn = document.getElementById("doRoleAction") as HTMLInputElement;

                  // Get the <span> element that closes the modal
                  var span = document.getElementsByClassName("close")[0] as HTMLInputElement;
                  
                  // Get list of all players
                  var str = '<ul>'
                  var list = lobbyState.playerList;
                  for (var i = 0; i < list.length; i++){
                    var player = list[i].nickname;
                    str += '<li>'+ player + '</li>';
                    str += '</ul>';
                  }

                  var nameContainer = document.getElementById("nameContainer") as HTMLInputElement;
                  nameContainer.innerHTML = str;

                  // When the user clicks on the button, open the modal 
                  btn.onclick = function() {
                    modal.style.display = "block";
                  }

                  // When the user clicks on <span> (x), close the modal
                  span.onclick = function() {
                    modal.style.display = "none";
                  }

                  // When the user clicks anywhere outside of the modal, close it
                  window.onclick = function(event) {
                    if (event.target == modal) {
                      modal.style.display = "none";
                    }
                  }
                }}
                > Temp Role Action </button>
              </div>
              <br/>
              <div id="myModal" className="modal">
                <div className="modal-content">
                  <span className="close">&times;</span>
                  <h1 id="modalTitle"></h1>
                  <div id="nameContainer"></div>
                  <input type="text" id="frameName" name="frameName"></input>
                  <input type="text" id="ressurectName" name="ressurectName"></input>
                  <input type="text" id="executeName" name="executeName"></input>
                  <br/>
                  <button id="frameButton" onClick={() => {
                    var fname = document.getElementById("frameName") as HTMLInputElement;
                    var name = fname.value;
                    handleFramerTarget(name);
                  }}
                  >Frame Player </button>
                  <button id="ressurectButton" onClick={() => {
                    var fname = document.getElementById("ressurectName") as HTMLInputElement;
                    var name = fname.value;
                    handleRessurectionistTarget(name);
                  }}
                  >Revive Player</button>
                  <button id="executeButton" onClick={() => {
                    var fname = document.getElementById("executeName") as HTMLInputElement;
                    var name = fname.value;
                    handleExecutionerTarget(name);
                  }}
                  >Execute Player</button>
                </div>
              </div>
              <div>
                <button id="checkMafia" onClick={() => 
                {
                  // Hide role action stuff
                  var hide1 = document.getElementById("frameName") as HTMLInputElement;
                  var hide2 = document.getElementById("frameButton") as HTMLInputElement;
                  var hide3 = document.getElementById("ressurectName") as HTMLInputElement;
                  var hide4 = document.getElementById("ressurectButton") as HTMLInputElement;
                  var hide5 = document.getElementById("executeName") as HTMLInputElement;
                  var hide6 = document.getElementById("executeButton") as HTMLInputElement;
                  hide1.style.display = "none"
                  hide2.style.display = "none"
                  hide3.style.display = "none"
                  hide4.style.display = "none"
                  hide5.style.display = "none"
                  hide6.style.display = "none"

                  // Get the modal and title
                  var modal = document.getElementById("myModal") as HTMLInputElement;
                  var modalTitle = document.getElementById("modalTitle") as HTMLInputElement;
                  modalTitle.innerHTML = "Mafia Members"

                  // Get the button that opens the modal
                  var btn = document.getElementById("checkMafia") as HTMLInputElement;

                  // Get the <span> element that closes the modal
                  var span = document.getElementsByClassName("close")[0] as HTMLInputElement;
                  
                  // Get list of all players in list
                  var str = '<ul>'
                  // var list = lobbyState.gamesState.mafiaList;
                  // for (var i = 0; i < list.length; i++){
                  //   var player = list[i].nickname;
                  //   str += '<li>'+ player + '</li>';
                  //   str += '</ul>';
                  // }

                  var nameContainer = document.getElementById("nameContainer") as HTMLInputElement;
                  nameContainer.innerHTML = str;

                  // When the user clicks on the button, open the modal 
                  btn.onclick = function() {
                    modal.style.display = "block";
                  }

                  // When the user clicks on <span> (x), close the modal
                  span.onclick = function() {
                    modal.style.display = "none";
                  }

                  // When the user clicks anywhere outside of the modal, close it
                  window.onclick = function(event) {
                    if (event.target == modal) {
                      modal.style.display = "none";
                    }
                  }
                }}
                > View Mafia List </button>
              </div>
              <br/>
              <div>
                <button id="viewDeadPlayers" onClick={() => 
                {
                  // Hide role action stuff
                  var hide1 = document.getElementById("frameName") as HTMLInputElement;
                  var hide2 = document.getElementById("frameButton") as HTMLInputElement;
                  var hide3 = document.getElementById("ressurectName") as HTMLInputElement;
                  var hide4 = document.getElementById("ressurectButton") as HTMLInputElement;
                  var hide5 = document.getElementById("executeName") as HTMLInputElement;
                  var hide6 = document.getElementById("executeButton") as HTMLInputElement;
                  hide1.style.display = "none"
                  hide2.style.display = "none"
                  hide3.style.display = "none"
                  hide4.style.display = "none"
                  hide5.style.display = "none"
                  hide6.style.display = "none"

                  // Get the modal and title
                  var modal = document.getElementById("myModal") as HTMLInputElement;
                  var modalTitle = document.getElementById("modalTitle") as HTMLInputElement;
                  modalTitle.innerHTML = "Dead Members"

                  // Get the button that opens the modal
                  var btn = document.getElementById("viewDeadPlayers") as HTMLInputElement;

                  // Get the <span> element that closes the modal
                  var span = document.getElementsByClassName("close")[0] as HTMLInputElement;
                  
                  // Get list of all players in list
                  var str = '<ul>'
                  // var list = lobbyState.gamesState.deadPlayerList;
                  // for (var i = 0; i < list.length; i++){
                  //   var player = list[i].nickname;
                  //   str += '<li>'+ player + '</li>';
                  //   str += '</ul>';
                  // }

                  var nameContainer = document.getElementById("nameContainer") as HTMLInputElement;
                  nameContainer.innerHTML = str;

                  // When the user clicks on the button, open the modal 
                  btn.onclick = function() {
                    modal.style.display = "block";
                  }

                  // When the user clicks on <span> (x), close the modal
                  span.onclick = function() {
                    modal.style.display = "none";
                  }

                  // When the user clicks anywhere outside of the modal, close it
                  window.onclick = function(event) {
                    if (event.target == modal) {
                      modal.style.display = "none";
                    }
                  }
                }}
                > View Dead Player List </button>
              </div>
              <br/>
              <div>
                <h3>Message from Game: {lobbyState.gameState.allPlayersMessage}</h3>
              </div>
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
          <button className='myBMaf' type='submit' onClick={() => { handleGameChoice('coup') }}>COUP
            <p className='descMaf'>HELLO THIS IS COUP BABY hi</p>
          </button>
        </div>
        <div className='middle'>
          <div className='chat'>Players:

            <div style={{ width: "100%", height: "90%", marginTop: '10%' }}>
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
            <Game game={lobbyState.game} socket={socket} />
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