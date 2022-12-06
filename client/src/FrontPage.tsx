import React, { useState } from 'react';
import './FrontPage.css';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function FrontPage () {
  const isLoading = useState(false)
  const userName = useSelector((state: any) => state.userState.username);
  const token = useSelector((state: any) => state.userState.token)
  const [nickname, setNickname] = useState('name')
  const [lobbyCode, setLobbyCode] = useState('0')
  const [lookupUser, setLookupUser] = useState("");


  const dispatch = useDispatch();
  //URL FOR API NEED TO BE UPDATED
  const handleSubmitCreate = () => {
    console.log("isnide of handle submit create")
    fetch('/api/lobby/create')
      .then((res) => res.json())
      .then((data) => {
        console.log("got data from api: ", data)
        dispatch({type: 'updateLobby', payload: data})
        dispatch({type: 'updatePlayer', payload: {nickname: nickname, host: true}})

      })    
  }
  const handleSubmit = () => {
    console.log("calling with nickname ", nickname)
    fetch(`/api/lobby/join?lobbyCode=${lobbyCode}&nickname=${nickname}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("got data from api: ", data)
      dispatch({type: 'updateLobby', payload: data})
      dispatch({type: 'updatePlayer', payload: {nickname: nickname, host: false}})

    })


  }

  if (token == "BAD_LOGIN" && !isLoading) {
    console.log("bad login")
    alert("bad login");
  }


  return (
    <div className='container'>
      <div className='login'>
        <Link to="/Login">
          <button className='myButton' type='submit'>Login</button>
        </Link>
        
          {userName == undefined ? (<>
          {/* code displayed if username is undefined */}
          <p>
          <input type="text" placeholder="Username" onChange={(e) => setLookupUser(e.target.value)} />
          <Link to={`/u/${lookupUser}`}>Search</Link>
            </p>
          </>) : (<>
          {/* Code displayed if user is defined */}
          <p><Link to="/account">{userName}</Link></p>
          </>)}
          

      </div>

      <div className='box'>
        <h1>Fun With Friends</h1>
      </div>

      <div className='box'>
        <h1>Join Lobby</h1>
        <input type="text" placeholder="Nickname" onChange={(e) => setNickname(e.target.value)} />
        <input type="text" placeholder="LobbyID" onChange={(e) => setLobbyCode(e.target.value)} />
        <div>
        <Link to="/MainLobby">
            <button className='myButton' type='submit' onClick={handleSubmit}>Join</button>
          </Link>
        </div>


        <h1>Create Lobby</h1>
          <input type="text" placeholder="Nickname" onChange={(e) => setNickname(e.target.value)} />
          <div>
            <Link to="/MainLobby">
              <button className='myButton' type='submit' onClick={handleSubmitCreate}>Create</button>
            </Link>
          </div>
      </div>

    </div>


  )
}

