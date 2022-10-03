import React, { Component } from 'react';
import './MainLobby.css';
import Game from './pages/game';
// @ts-ignore
import TextLog from './textLog.jsx';

export default class MainLobby extends Component {
  state = {
    log: ['hello and welcome', "hello"],
    msg: "",
    game: "Mafia",
  }
  handleSubmit = async (e) => {
    console.log(this.state.msg + "hi");
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
    return (
      <>
        <div className='titleBox'>
          <h1>Fun With Friends</h1>
        </div>
        <div className='outerBox'>
          <div className='navBar'>
            <button className='myB' type='submit'>Game1</button>
            <button className='myB' type='submit'>Game2</button>
            <button className='myB' type='submit'>Game3</button>
            <button className='myB' type='submit'>Game4</button>
          </div>
          <div className='middle'>
            <div className='chat'>Players

              <div>
                <form onSubmit={this.handleSubmit}>
                  <div id='chatBox'>
                    <hr></hr>
                    <input className='textBox' type="text" placeholder="UserName" onChange={(e) => this.setState({ msg: e.target.value })} />
                    <button className='myB' type='submit'>Invite</button>
                  </div>

                </form>
              </div>
            </div>
            <div className='screen'>
              <Game game={this.state.game} />
            </div>
            <div className='chat'>chat
              <ul className="list-group">
                {this.state.log.map(listitem => (
                  <li key={listitem}>
                    {listitem}
                  </li>
                ))}
              </ul>
              <div>
                <form onSubmit={this.handleSubmit}>

                  <div id='chatBox'>
                    <hr></hr>
                    <input className='textBox' type="text" placeholder="type message" onChange={(e) => this.setState({ msg: e.target.value })} />
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