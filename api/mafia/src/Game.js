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

function doVote()
{
  // Initialize list of votes
  let votesPerPlayer = {};

  // Do voting with game system

  // Get responses from user and update votes per player dict accordingly

  // Get max and player name from votes per player
  let max = 0;
  let tie = 0;
  let player = "";
  for (const [key, value] of Object.entries(object)) 
  {
    // If current player has most votes then update max and player
    if (value > max)
    {
      max = value;
      player = key
    }
  }
}

function getNightSummary()
{
  // Initialize empty night summary string
  let nightSummary = ""

  // Go through graveyard and find all dead players
  for (let deadPlayer = 0; deadPlayer < this.graveyard.length; deadPlayer++)
  {
    // Add dead player name to summary list
    nightSummary += "Oh no!" + deadPlayer.userId + "has died"
  }

  // Send night summary to each player
}

/**
 * Check if a given player is alive.
 * @param {Player} player 
 * @returns true if player is alive.
 */
function isAlive(player) {
    // TODO: Check if player is in graveyard.
    for (let play = 0; play < this.graveyard.length; play++) {
      if (player.userId == play.userId) {
        return true;
      }
    }
    return false;
}