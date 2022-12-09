import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Container, Row, Col} from 'reactstrap';

// import './FrontPage.css';
import './styles/imported/seo.css'


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
        dispatch({type: 'updatePlayer', payload: {nickname: nickname, host: true, isAlive: true, card1: 0, card1Alive: true, card2: 0, card2Alive: true, numCoins: 3, numCards: 2}})

      })    
  }
  const handleSubmit = () => {
    console.log("calling with nickname ", nickname)
    fetch(`/api/lobby/join?lobbyCode=${lobbyCode}&nickname=${nickname}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("got data from api: ", data)
      dispatch({type: 'updateLobby', payload: data})
      dispatch({type: 'updatePlayer', payload: {nickname: nickname, host: false, isAlive: true, card1: 0, card1Alive: true, card2: 0, card2Alive: true, numCoins: 3, numCards: 2}})

    })


  }

  if (token == "BAD_LOGIN" && !isLoading) {
    console.log("bad login")
    alert("bad login");
  }


  return (
    <>
      <header className='header-area'>
      <Container style={{maxWidth:'100%', justifyContent:'center', }}>
      <Row style={{paddingBottom: '1%', paddingTop: '1%'}}>
        <Col className='col-2'>
        </Col>
        <Col className='col-2'>
        <Link to="/Login">
          <button className='second-button' type='submit'>Login</button>
        </Link>
        </Col>
        <Col className='col-4 siteHeader'>
          <h1>Fun with Friends</h1>
        </Col>
        <Col className='col-2'>
          {userName == undefined ? (<>
            {/* code displayed if username is undefined */}
            

          <input type="text" placeholder="Username" onChange={(e) => setLookupUser(e.target.value)} /><button className='main-button'><Link to={`/u/${lookupUser}`} style={{color:'white'}}>Search</Link></button>
              
            </>) : (<>
            {/* Code displayed if user is defined */}
            <p><Link to="/account"><button className='main-button'>My Account</button></Link></p>
            </>)}
        </Col>
        <Col className='col-2'>
        </Col>
      </Row>
      </Container>
      </header>
      <div className='pageContent'>
      <Container>
      <Row >
        <Col className='col-3'></Col>
        <Col className='col-6'>
        <div className='myBox'>
          <h1>Play a game</h1>
          <hr></hr>
            <div className=''>
              <h2>Join Lobby</h2>
              <input type="text" placeholder="Nickname" onChange={(e) => setNickname(e.target.value)} />
              <input type="text" placeholder="LobbyID" onChange={(e) => setLobbyCode(e.target.value)} />
            <div>
            <Link to="/MainLobby">
              <button  className='main-button' type='submit' onClick={handleSubmit}>Join</button>
              </Link>
            </div>
            <h2>Create Lobby</h2>
            <input type="text" placeholder="Nickname" onChange={(e) => setNickname(e.target.value)} />
            <div>
              <Link to="/MainLobby">
              <button  className='main-button' type='submit' onClick={handleSubmitCreate}>Create</button>
              </Link>
            </div>
          </div>
        </div>

        </Col>
        <Col className='col-3'></Col>

      </Row>
    </Container>
      </div>
   
    </>
    

  )
}

