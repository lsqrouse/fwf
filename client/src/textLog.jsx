
import React, { Component } from "react";

class TextLog extends Component {
   
    state = {
    listitems: [
      this.props.texts
    ]
  };

  

  render() {
    console.log(this.state.listitems);
    return (
      <React.Fragment>
        <ul className="list-group">
          {this.state.listitems.map(listitem => (
            <li key={listitem.msg}>
              {listitem.context}
            </li>
          ))}
        </ul>
      </React.Fragment>
    );
  }
}

export default TextLog;