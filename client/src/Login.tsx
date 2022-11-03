import React, { useState } from 'react';
import './Login.css';
import './FrontPage.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Login() {


  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [isLoading, setIsLoading] = useState(false)
  const userState = useSelector((state: any) => state.userState);
  const lobbyState = useSelector((state: any) => state.lobbyState);

  console.log("userstate is", userState)
  console.log("lobbystate", lobbyState)


  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleCreateAccount = () => {
    setIsLoading(true)
    console.log("hitting ", `/api/accounts/create?uname=${username}&pass=${password}&email=${email}`)
    fetch(`/api/accounts/create?uname=${username}&pass=${password}&email=${email}`)
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
        <div className='container'>
        <div className="login">
          <Link to="/">
            <button className='myButton'>Back</button>
          </Link>
        </div>

        <div className='box'>

          <h1>Fun With Friends</h1>
        </div>

        <div className='box'>
          <h1>Login</h1>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="text" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <div>
                <button className='myButton' type='submit' onClick={handleLogin}>Login</button>
            </div>



          <h1>Create Account</h1>
          <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="text" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <div>
                <button className='myButton' type='submit' onClick={handleCreateAccount}>Sign Up</button>
            </div>

        </div>

      </div>
        </>) : (<></>)}
      </>
    )
  }
