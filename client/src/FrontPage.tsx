import React, { Component } from 'react';
import './FrontPage.css';
import { useState } from "react";

export default class FrontPage extends Component {
    state = {
        userName: "",
        lobbyID: 0
    }
    //URL FOR API NEED TO BE UPDATED
    handleSubmitCreate = async (e) => {
        e.preventDefault();
    try {
      let res = await fetch("http://localhost:3001/create", {
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
      console.log(err + "ASFASFASFASFASFASFASf");
    }

    }
    handleSubmit = async (e) => {
        e.preventDefault();
    try {
      let res = await fetch("http://localhost:3001/", {
        method: "POST",
        body: JSON.stringify({
          userName: this.state.userName,
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
      console.log(err + "ASFASFASFASFASFASFASf");
    }

    }


    render() {
        return(
            <div className='container'>
                <div className='login'>
                  <button className='myButton' type='submit'>Login</button>
                </div>
                
                <div className='box'>
                    <h1>Fun With Friends</h1>
                </div>

                <div className='box'>
                    <h1>Join Lobby</h1>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" placeholder="Username" onChange={(e) => this.setState({userName: e.target.value})}/>
                        <input type="text" placeholder="LobbyID" onChange={(e) => this.setState({lobbyID: e.target.value})}/>
                        <div>
                         <button className='myButton' type='submit'>Join</button>
                        </div>
                        
                    </form>   
                    
                    
                    <h1>Create Lobby</h1>
                    <form onSubmit={this.handleSubmitCreate}>
                        <input type="text" placeholder="Username" onChange={(e) => this.setState({userName: e.target.value})}/>
                        <div>
                           <button className='myButton' type='submit'>Create</button>
                        </div>
                    </form>  
                   
                </div>

            </div>
            

        )
      }
}

