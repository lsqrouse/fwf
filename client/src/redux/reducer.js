const initialState = {
  lobbyState: {
    lobbyHost: '',
    gameState: {}
  },
  playerState: {},
  userState: {
    uname: 'name'
  },
  userState: {

  }
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'updateLobby': {
      console.log("state is: ", state)
      console.log("action is ", action)
      // Can return just the new todos array - no extra object around it
      return {
        ...state,
        lobbyState: action.payload,
      }
    }
    case 'updatePlayer': {
      console.log("state is: ", state)
      console.log("action is ", action)
      // Can return just the new todos array - no extra object around it
      return {
        ...state,
        playerState: action.payload,
      }
    }
    case 'updateUser': {
      console.log("state is: ", state)
      console.log("action is ", action)
      // Can return just the new todos array - no extra object around it
      return {
        ...state,
        userState: action.payload,
      }
    }
    default:
      return state
  }
}
