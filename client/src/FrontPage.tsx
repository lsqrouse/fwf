import React, { Component } from 'react';
import './FrontPage.css';
import { useState } from "react";

export default class FrontPage extends Component {
    state = {
        userName: "",
        lobbyID: 0
    }

    handleSubmit = async (e) => {
        e.preventDefault();
    try {
      let res = await fetch("https://httpbin.org/post", {
        method: "POST",
        body: JSON.stringify({
          userName: this.state.userName,
          lobbyID: this.state.lobbyID
        }),
      });
      let resJson = await res.json();
      if (res.status === 200) {
        this.setState({
            userName: "",
            lobbyID: 0,
        })
        
      } else {
        console.log("ERRRRRRRRRRRRRRR");
      }
    } catch (err) {
      console.log(err);
    }

    }


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
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" placeholder="Username" onChange={(e) => this.setState({userName: e.target.value})}/>
                    </form>  
                    <button className='myButton'>Create</button>
                </div>

            </div>
            

        )
      }
}

