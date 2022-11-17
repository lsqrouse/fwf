const teams = {
  "Village": {
    name: "Village",
    winCondition: "Stop the Mafia from killing the Village!"
  },

  "Mafia": {
    name: "Mafia",
    winCondition: "Eliminate the Village before they eliminate you and the other Mafia!",
    meetingAbility: "Vote on who to kill."
  },

  "Jester": {
    name: "Jester",
    winCondition: "Get voted out, whatever the cost!"
  },

  "Executioner": {
    name: "Executioner",
    winCondition: "Get your target voted out, whatever the cost!"
  }
}

export default teams;