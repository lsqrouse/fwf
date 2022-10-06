import React, { useState } from 'react';
import './FrontPage.css';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export default function FrontPage () {
  const [userName, setUserName] = useState("name");
  const [lobbyCode, setLobbyCode] = useState('0')

  const dispatch = useDispatch();
  //URL FOR API NEED TO BE UPDATED
  const handleSubmitCreate = () => {
    console.log("isnide of handle submit create")
    fetch('/api/lobby/create')
      .then((res) => res.json())
      .then((data) => {
        console.log("got data from api: ", data)
        dispatch({type: 'updateLobby', payload: data})
        dispatch({type: 'updatePlayer', payload: {nickname: userName}})

      })    // try {
    //   let res = await fetch("http://localhost:3001/api/accounts/create", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       userName: this.state.userName,
    //       lobbyID: this.state.lobbyID
    //     }),
    //   });
    //   let resJson = await res.json();
    //   if (res.status === 200) {
    //     this.setState({
    //       userName: "",
    //       lobbyID: 0,
    //     })

    //   } else {
    //     console.log("ERRRRRRRRRRRRRRR");
    //   }
    // } catch (err) {
    //   console.log(err + "ASFASFASFASFASFASFASf");
    // }



  }
  const handleSubmit = () => {
    fetch('/api/lobby/join?lobbyCode=' + lobbyCode)
    .then((res) => res.json())
    .then((data) => {
      console.log("got data from api: ", data)
      dispatch({type: 'updateLobby', payload: data})
      dispatch({type: 'updatePlayer', payload: {nickname: userName}})

    })
    // try {
    //   let res = await fetch("http://localhost:3001/", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       userName: this.state.userName,
    //     }),
    //   });
    //   let resJson = await res.json();
    //   if (res.status === 200) {
    //     this.setState({
    //       userName: "",
    //       lobbyID: 0,
    //     })

    //   } else {
    //     console.log("ERRRRRRRRRRRRRRR");
    //   }
    // } catch (err) {
    //   console.log(err + "ASFASFASFASFASFASFASf");
    // }

  }


  return (
    <div className='container'>
      <div className='login'>
        <Link to="/Login">
          <button className='myButton' type='submit'>Login</button>
        </Link>
        <p>{userName}</p>

      </div>

      <div className='box'>
        <h1>Fun With Friends</h1>
      </div>

      <div className='box'>
        <h1>Join Lobby</h1>
        <input type="text" placeholder="Username" onChange={(e) => setUserName(e.target.value)} />
        <input type="text" placeholder="LobbyID" onChange={(e) => setLobbyCode(e.target.value)} />
        <div>
        <Link to="/MainLobby">
            <button className='myButton' type='submit' onClick={handleSubmit}>Join</button>
          </Link>
        </div>



        <h1>Create Lobby</h1>
          <input type="text" placeholder="Username" onChange={(e) => setUserName(e.target.value)} />
          <div>
            <Link to="/MainLobby">
              <button className='myButton' type='submit' onClick={handleSubmitCreate}>Create</button>
            </Link>
          </div>
      </div>

    </div>


  )
}

