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

const roles = {
  "Villager": {
    name: "Villager",
    team: "Village",
    winCondition: `${teams.Village.winCondition}`
  },

  "Mafia": {
    name: "Mafia",
    team: "Mafia",
    winCondition: `${teams.Mafia.winCondition}`,
    abilitiesDesc: "Vote with the other Mafia to kill someone at night!",
  },

  "Detective": {
    name: "Detective",
    team: "Village",
    winCondition: `${teams.Village.winCondition}`,
    ability: "investigate",
    abilitiesDesc: "Investigate someone to figure out their team.",
    abilityMessage: "Choose some to investigate tonight."
  },

  "Doctor": {
    name: "Doctor",
    team: "Village",
    winCondition: `${teams.Village.winCondition}`,
    ability: "save",
    abilitiesDesc: "Protect someone from dying one night.",
    abilityMessage: "Choose someone to protect tonight."
  },

  "Vigilante": {
    name: "Vigilante",
    team: "Village",
    winCondition: `${teams.Village.winCondition}`,
    ability: "kill",
    abilitiesDesc: "Use your gun to kill someone.",
    abilityMessage: "Choose someone to kill tonight."
  },

  "Drunk": {
    name: "Drunk",
    team: "Village",
    winCondition: `${teams.Village.winCondition}`,
    ability: "block",
    abilitiesDesc: "Block someone from using their ability. You are immune to being blocked.",
    abilityMessage: "Choose someone to block their ability tonight."
  },

  "Swapper": {
    name: "Swapper",
    team: "Village",
    winCondition: `${teams.Village.winCondition}`,
    ability: "swap",
    abilitiesDesc: "Swap two players (can include yourself). Anyone who targets the first player will target the second player, and anyone who targets the second player will target the first player.",
    abilityMessage: "Choose two players to swap tonight."
  },

  "Ressurectionist": {
    name: "Ressurectionist",
    team: "Village",
    winCondition: `${teams.Village.winCondition}`,
    ability: "ressurect",
    abilitiesDesc: "Once per game, bring one player from the graveyard back alive.",
    abilityMessage: "Choose someone to ressurect tonight."
  },

  "Bomb": {
    name: "Bomb",
    team: "Village",
    winCondition: `${teams.Village.winCondition}`,
    abilitiesDesc: "If you get killed at night, you explode and take down your attacker with you.",
  },

  "Distractor": {
    name: "Distractor",
    team: "Mafia",
    winCondition: `${teams.Mafia.winCondition}`,
    ability: "block",
    abilitiesDesc: "Block someone from using their ability. You are immune to being blocked.",
    abilityMessage: "Choose someone to block their ability tonight."
  },

  "Framer": {
    name: "Framer",
    team: "Mafia",
    winCondition: `${teams.Mafia.winCondition}`,
    ability: "frame",
    abilitiesDesc: "Make someone appear as Mafia if they are investigated during the same night.",
    abilityMessage: "Choose someone to frame tonight."
  },

  "Informant": {
    name: "Informant",
    team: "Mafia",
    winCondition: `${teams.Mafia.winCondition}`,
    ability: "identify",
    abilitiesDesc: "Make someone appear as Mafia if they are investigated during the same night.",
    abilityMessage: "Choose someone to investigate."
  },

  "Jester": {
    name: "Jester",
    team: "Jester",
    winCondition: `${teams.Jester.winCondition}`,
  },

  "Executioner": {
    name: "Executioner",
    team: "Executioner",
    winCondition: `${teams.Executioner.winCondition}`,
    abilitiesDesc: "None. But you know that your target is part of the Village."
  }
};

exports.roles = roles;
exports.teams = teams;