const Player = require("./Player");

class Game {
  constructor(allUsers, roleList, settings) {
    this.allPlayers = assignRoles(allUsers, roleList);
    this.graveyard = new List(); // When a player dies, add them to this list
  }
}

function assignRoles(allUsers, roleList) {
    // TODO: Randomly assign each role to a user. Need to create an instance of Player for each user,
    // then return all players as a list.

    return;
}

function whoHasWon() {
    // TODO: Determine which team, if any, has won. If no one has one yet, return null.

    return null;
}

/**
 * Check if a given player is alive.
 * @param {Player} player 
 * @returns true if player is alive.
 */
function isAlive(player) {
    // TODO: Check if player is in graveyard.
    return false;
}