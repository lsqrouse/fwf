import React, { useEffect, useState } from 'react';
import './Login.css';
import './FrontPage.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

import './styles/imported/seo.css'

export default function Login() {


  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [profDesc, setProfDesc] = useState<string>();
  const [isLoading, setIsLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true);
  const userState = useSelector((state: any) => state.userState);
  const lobbyState = useSelector((state: any) => state.lobbyState);
  const [errorMsg, setErrorMsg] = useState<string>("");

  console.log("userstate is", userState)
  console.log("lobbystate", lobbyState)


  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleCreateAccount = (e) => {
    e.preventDefault();
    console.log(e)
    setIsLoading(true)
    if (username == undefined || password ==undefined || email ==undefined || profDesc == undefined) {
        setErrorMsg("Please fill out all fields before creating an account\n");
        navigate("/Login")
    } else {
      console.log("hitting ", `/api/accounts/create?uname=${username}&pass=${password}&email=${email}`)
      fetch(`/api/accounts/create?uname=${username}&pass=${password}&email=${email}&profDesc=${profDesc}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("recieved this from api, ", data)
          dispatch({type: 'updateUser', payload: data});
          setIsLoading(false)
          if (data.token != "BAD_CREATE") {
            navigate("/")
          }
        })
    }

  }

  const handleLogin = () => {
    console.log("making login call now with ", username, ", ", password)
    setIsLoading(true)
    fetch(`/api/accounts/login?uname=${username}&pass=${password}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("recieved this from api, ", data)
        dispatch({type: 'updateUser', payload: data});
        setIsLoading(false)
        if (data.token != "BAD_LOGIN") {
          navigate("/")
        }
      })  }

    if (userState.token == "BAD_LOGIN" && !isLoading) {
        console.log("bad login")
        alert("bad login");
        userState.token = ""
        dispatch({type: 'updateUser', payload: userState});
    }
    return (
      <>
      {!isLoading ? (<>
        <header className='header-area'>
      <Container style={{maxWidth:'100%', justifyContent:'center', }}>
      <Row style={{paddingBottom: '1%', paddingTop: '1%'}}>
        <Col className='col-2'>
        </Col>
        <Col className='col-2'>
        <Link to="/">
          <button className='second-button' >Back</button>
        </Link>
        </Col>
        <Col className='col-4 siteHeader'>
          <h1>Fun with Friends</h1>
        </Col>
        <Col className='col-2'>
          
        </Col>
        <Col className='col-2'>
        </Col>
      </Row>
      </Container>
      </header>
      <div className='pageContent'>
      <Container>
        <Row>
          <Col className='col-3'></Col>
          <Col className='col-6'>
          <div className='myBox'>
            {isLogin ? (<><h1>Login</h1>
          <hr></hr>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} /><br/>
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <div>
                <button className='main-button' type='submit' onClick={handleLogin}>Login</button>
            </div>
            <p className='smallText'>Don't have an account? Create one here:</p>
            <button className='second-button' onClick={() => setIsLogin(false)}>Create an Account</button>
</>) : (<>     
              <h1 className='loginTitle'>Create Account</h1>
              <hr></hr>

              <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} /><br/>
                <input type="text" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br/>
                <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} /> <br/>
                Profile Description: <br/>
                <p className='textArea'><textarea onChange={(e) => setProfDesc(e.target.value)} rows={3} cols={40}/></p>

              <div>
                <button className='main-button' onClick={handleCreateAccount}>Sign Up</button>
              </div>
              <p className='smallText'>Already have an account? Log in here:</p>
              <button className='second-button' onClick={() => setIsLogin(true)}> Log in</button>
              </>)}
              



     
          </div>
          </Col>
          <Col className='col-3'></Col>

        </Row>


      </Container>
      </div>

        </>) : (<></>)}
      </>
    )
  }
