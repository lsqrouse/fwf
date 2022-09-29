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
    let test = []
    let left = JSON.parse(JSON.stringify(roleList))
    for (let i of allUsers) {
      if (left.length > 0) {
        let ran = Math.floor(Math.random() * left.length)
        //test.push({ user: i,name: left[ran].name,img: left[ran].img})
        left.splice(ran, 1)
      } else {
        //test.push({user: i,name: "Hitman",img:'hitman.png'})
      }
    }
    return test;
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