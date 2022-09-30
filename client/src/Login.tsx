import React, { Component } from 'react';
import './Login.css';
import './FrontPage.css';
export default class Login extends Component {
    
    state = {
        userName: "",
        password: "",
        email: "",
    }


    handleSubmitCreate = async (e) => {
        e.preventDefault();
        console.log(
                    
          "making request"
          )
          fetch(`/api/accounts/create?uname=${this.state.userName}&pass=${this.state.password}&email=${this.state.email}`)
          .then((res) => res.json())
          .then((data) => console.log("recieved this from api, ", data))
    }

      


    handleSubmit = async (e) => {
        e.preventDefault();
    try {
      let res = await fetch("http://localhost:3001/", {
        method: "POST",
        body: JSON.stringify({
          userName: this.state.userName,
          password: this.state.password
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

                <div className='box'>
                    <h1>Fun With Friends</h1>
                </div>

                <div className='box'>
                    <h1>Login</h1>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" placeholder="Username" onChange={(e) => this.setState({userName: e.target.value})}/>
                        <input type="text" placeholder="Passoword" onChange={(e) => this.setState({password: e.target.value})}/>
                        <div>
                         <button className='myButton' type='submit'>Login</button>
                        </div>
                        
                    </form>   
                    
                    
                    <h1>Create Account</h1>
                    <form onSubmit={this.handleSubmitCreate}>
                        <input type="text" placeholder="Username" onChange={(e) => this.setState({userName: e.target.value})}/>
                        <input type="text" placeholder="Passoword" onChange={(e) => this.setState({password: e.target.value})}/>
                        <input type="text" placeholder="email" onChange={(e) => this.setState({email: e.target.value})}/>
                        <div>
                           <button className='myButton' type='submit'>Sign Up</button>
                        </div>
                    </form>  
                   
                </div>

            </div>
            

        )
      }


}