import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './MainLobby.css';
import Game from './pages/game';
import { AgGridReact } from 'ag-grid-react';

// @ts-ignore
import TextLog from './textLog.jsx';
export default class MainLobby extends Component {
  constructor (props) {
    super(props);
    console.log('props: ', props)
    this.state.serverInfo = props.serverInfo
  }
  state = {
    log: ['hello and welcome', "hello"],
    msg: "",
    game: "None",
    name: "Name",
    serverInfo: {playerList: []}
  }

  colDefs = [
    {field: 'id'}
  ]

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
    console.log(this.state);
    return (
      <>
        <div className="login">
          <Link to="/">
            <button className='myButton'>Back</button>
          </Link>
          <Link to="/Instructions">
            <button className='myButton'>Instructions</button>
          </Link>
        </div>
        <div className='titleBox'>
          <h1>Fun With Friends</h1>
        </div>
        <div className='outerBox'>
          <div className='navBar'>
            {/* <Link to="/Mafia"> */}
              <button className='myBMaf' type='submit' onClick={() => {
                this.setState({ game: 'Mafia' });
              }}>Mafia
                <p className='descMaf'>HELLO THIS IS MAFIA BABY hi</p>
              </button>
            {/* </Link> */}

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
          <div className='ag-theme-alpine' style={{height: 400, width: 600}}>
       </div>
        </div>
      </>

    )
  }


}