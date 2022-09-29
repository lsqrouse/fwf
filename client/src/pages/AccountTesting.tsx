import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import TestGame from './TestGame';

export default function AccountTesting() {
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>("");
    const [repeatPass, setRepeatPass] = useState<string>("r");

    const [isLogin, setIsLogin] = useState<boolean>(true);

    const handleSubmit = () => {
        //handle logging in
        if (isLogin) {
            console.log("making call now with ", username, ", ", password)
            fetch(`/api/accounts/login?uname=${username}&pass=${password}`)
            .then((res) => res.json())
            .then((data) => console.log("recieved this from api, ", data))
        } else {
            //handle account creation
            console.log("inside of create account")
            //only make the api call if the passwords are the same
            if (password == repeatPass) {
                console.log(
                    
                "making request"
                )
                fetch(`/api/accounts/create?uname=${username}&pass=${password}`)
                .then((res) => res.json())
                .then((data) => console.log("recieved this from api, ", data))
            }


        }
    }

    return <>
    { isLogin ? <>
            <label>Username </label>
            <input type="text" name="uname" onChange={e => setUsername(e.target.value)} required />
            <br/>
            <label>Password </label>
            <input type="password" name="pass" onChange={e => setPassword(e.target.value)}  required />
            <br/>

            {/* <input type="submit" /> */}
            <button onClick={handleSubmit}> Submit </button>
            <button onClick={() => setIsLogin(false)}> Need to create an account? </button>
            </>
        : <>
            <label>Username </label>
            <input type="text" name="uname" onChange={e => setUsername(e.target.value)} required />
            <br/>
            <label>Password </label>
            <input type="password" name="pass" onChange={e => setPassword(e.target.value)}  required />
            <br/>
            <label> Repeat Password </label>
            <input type="password" name="repeat_pass" onChange={e => setRepeatPass(e.target.value)}  required />
            <br/>

            <button onClick={handleSubmit}> Submit </button>
            <button onClick={() => setIsLogin(true)}> Already have an account?</button>
        </>}


    </>
}