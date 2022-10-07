
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

export default function Instructions() {
  const lobbyState = useSelector((state: any) => state.lobbyState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLeave = () => {
    var curLobbyState = lobbyState;
   
    dispatch({ type: 'updateLobby', payload: lobbyState})
    console.log("disconnecting: ");
  }
  return (
    <div>
        <div className="login">
          <Link to="/MainLobby">
            <button className='myButton'>Back</button>
          </Link>
            
         
        </div>
        <ul>
            <li>
                <h1>Mafia
                    <p>Some Description</p>
                </h1>
            </li>
            <li>
                <h1>Coup
                <p>Some Description</p>
                </h1>
            </li>
            <li>
                <h1>Game 1
                <p>Some Description</p>
                </h1>
            </li>
            <li>
                <h1>Game 2
                <p>Some Description</p>
                </h1>
            </li>
        </ul>
    </div>
    
  );
}