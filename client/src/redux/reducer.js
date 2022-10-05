const initialState = {}

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
    default:
      return state
  }
}