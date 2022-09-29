import React, { Component } from 'react';
import './MainLobby.css';


export default class MainLobby extends Component {
    state = {
        msg: "",
        
    }
    
    handleSubmit = async (e) => {
        e.preventDefault();
    try {
      let res = await fetch("http://localhost:3001/", {
        method: "POST",
        body: JSON.stringify({
          msg: this.state.msg
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
            <>
            <div className='titleBox'>
                <h1>Fun With Friends</h1>
            </div>
            <div className='outerBox'>
                <div className='navBar'>navbar
                    <ul></ul>
                </div>
                <div className='middle'>
                    <div className='players'>Players</div>
                    <div className='screen'>Screen</div>
                    <div className='chat'>chat
                        <div>
                        <form onSubmit={this.handleSubmit}>
                            <div id='chatBox'>
                            <input className ='textBox' type="text" placeholder="type message" onChange={(e) => this.setState({msg: e.target.value})}/>
                            
                            <button className='myB' type='submit'>send</button>
                            </div>
                            
                        </form>  
                        </div>                      
                    </div>
                </div>
                
                <div className="box">log</div>
                
            </div>
            </>
            
        )
    }


}