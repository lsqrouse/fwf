import React, { useState } from 'react';
import './Login.css';
import './FrontPage.css';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export default function Login() {

  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [email, setEmail] = useState<string>();

  const dispatch = useDispatch();


  const handleCreateAccount = () => {
    console.log("hitting ", `/api/accounts/create?uname=${username}&pass=${password}&email=${email}`)
    fetch(`/api/accounts/create?uname=${username}&pass=${password}&email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("recieved this from api, ", data)
        dispatch({type: 'updateUser', payload: data});
      })
  }

  const handleLogin = () => {
    console.log("making login call now with ", username, ", ", password)
    fetch(`/api/accounts/login?uname=${username}&pass=${password}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("recieved this from api, ", data)
        dispatch({type: 'updateUser', payload: data});
      })  }




  // const handleSubmit = () => {
  //   e.preventDefault();
  //   try {
  //     let res = await fetch("http://localhost:3001/", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         userName: this.state.userName,
  //         password: this.state.password
  //       }),
  //     });
  //     let resJson = await res.json();
  //     if (res.status === 200) {
  //       this.setState({
  //         userName: "",
  //         lobbyID: 0,
  //       })

  //     } else {
  //       console.log("ERRRRRRRRRRRRRRR");
  //     }
  //   } catch (err) {
  //     console.log(err + "ASFASFASFASFASFASFASf");
  //   }

  // }

    return (
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
              <Link to="/" >
                <button className='myButton' type='submit' onClick={handleLogin}>Login</button>
              </Link>
            </div>



          <h1>Create Account</h1>
          <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="text" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <div>
              <Link to="/">
                <button className='myButton' type='submit' onClick={handleCreateAccount}>Sign Up</button>
              </Link>
            </div>

        </div>

      </div>


    )
  }
