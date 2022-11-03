import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export default function ForgotPass() {

  const [email, setEmail] = useState<string>();

  const handleResetReq = () => {
    fetch(`/api/accounts/forgotPassword?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("recieved this from api, ", data)
      })  }

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
            <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <div>
              <Link to="/Login" >
                <button className='myButton' type='submit' onClick={handleResetReq}>Request Password Reset</button>
              </Link>
            </div>
        </div>

      </div>


    )
  }
