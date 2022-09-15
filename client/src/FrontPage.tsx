import React, { Component } from 'react';
import './FrontPage.css';
export default class FrontPage extends Component {
    render() {
        return(
            <div className='container'>

                <div className='box'>
                    <h1>Fun With Friends</h1>
                </div>

                <div className='box'>
                    <h1>Join Lobby</h1>
                    <form action="/url" method="POST">
                        <input type="text" placeholder="Username"/>
                        <input type="text" placeholder="LobbyID"/>
                    </form>   
                    
                    <button className='myButton'>Join</button>
                    <h1>Create Lobby</h1>
                    <form action="/url" method="POST">
                        <input type="text" placeholder="Username"/>
                    </form>  
                    <button className='myButton'>Create</button>
                </div>

            </div>
            

        )
      }
}