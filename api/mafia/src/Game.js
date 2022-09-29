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

    return [];
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

  // Send results to each player
  sendToAllPlayers(
    `<html>` + max.toString() + player.toString() + 
    `<html>`
  )
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
  sendToAllPlayers(
    `<html>` + nightSummary.toString() + 
    `<html>`
  )
}

function sendToAllPlayers(htmlData)
{
  // For loop to go through all players in player list
  for (let player = 0; player < this.allPlayers.length; player++)
  {
    // Send html data to each player
    print(player)
  }
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