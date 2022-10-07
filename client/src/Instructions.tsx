
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import './Instructions.css';
export default function Instructions() {
  const lobbyState = useSelector((state: any) => state.lobbyState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLeave = () => {
    var curLobbyState = lobbyState;

    dispatch({ type: 'updateLobby', payload: lobbyState })
    console.log("disconnecting: ");
  }
  return (
    <div>
      <div className="login">
        <Link to="/MainLobby">
          <button className='myButton'>Back</button>
        </Link>


      </div>
      <ul>
        <li>
          <h1>Mafia

            <p>Mafia is a social deduction game in which the Village must try and figure out who the Mafia are and vote them off, while the Mafia tries to not get found out while they slowly eliminate the members of the Town. Each player in the game is given a role (not necessarily unique). Most roles have a special ability tied to them. For example, the doctor, who is sided with the Village, can choose someone to protect at night from dying. The class diagram below illustrates that each Player has a unique instance of a Role, which is associated with a RoleType. The RoleType gives a definition of the role, while Role is the concrete instance of a role tied to a player. Each RoleType is associated with a Team, which represents a win condition. The main teams, as described before, are Village and Mafia. However, there are third-party roles with their own unique win conditions as well. Mafia win when they outnumber the Village, and the Village wins when all the Mafia have been eliminated.</p>
            <p>The game of Mafia is played in a repeating loop of night and day phases until a team achieves their win condition. Depending on the circumstance, more than one team can win at the same time (e.g. Jester and Mafia). At the beginning of the night phase, players are instructed to turn around and face away from each other. Then, players with an ability will select the targets of their ability. Those without abilities will simply press an “OK” button to proceed with the game. It is during this time that the Mafia collectively picks someone to kill. Although it is not illustrated in the diagram below, picking the kill target will involve a vote. Everyone confirming their abilities ends the night phase. The game will then check to see if any win condition has been satisfied. If not, then the game moves into the day phase, during which players discuss who they think is part of the Mafia and vote on someone to be eliminated. After a player is eliminated, the game again checks if a win condition has been satisfied. If not, then the game moved into the next night phase.</p>

          </h1>
        </li>
        <li>
          <h1>Coup
            <p>In Coup, the goal of the game is to eliminate all other players. When the game starts each player gets 2 cards and 3 coins. A random player then goes first. They can either play one of their card actions, or they can lie and claim to be another card and play its card action, or coup another player (force them to lose a card) by paying 7 coins. Any player can call the current player’s bluff, and if the current player was indeed lying then they will lose a card. However, if they were telling the truth then the challenger will be the one to lose a card. For example, if player A tries to assasinate player B using the assassin card, player B can challenge that player A doesn’t really have an assassin card. If the challenge goes through and player A doesn't have an assassin card then they lose a card, but if the challenge fails then player B will have to lose both of their cards. After one player goes the next player goes clockwise and so on until there is only one player left, the winner. In Coup the players have the opportunity to do what they want even though the cards they have may not reflect that and this leads to very dramatic and often poker-like games.</p>
          </h1>
        </li>
        <li>
          <h1>Fake Artist Goes to New York
            <p>In Fake Artist Goes to New York, the game randomly assigns a word and a player to be the fake artist. The word is revealed to every player except the fake artist. When the game begins, players in turn will attempt to draw the word revealed to them by the game on the big board until he or she lifts the pen (this means each player only gets one stroke to draw per turn). After every player has drawn twice, a vote starts and players can vote on who they think is the fake artist. Remember, the fake artist does not know what the word is. If the fake artist is voted out, he or she has a chance after the voting phase to guess what the word is. If the fake artist guesses correctly, he or she is allowed back in the game. The point of the game is for the players to vote out the fake artist, while the fake artist tries to blend in without being singled out. It is also in the players’ best interest to not reveal too much while drawing, so the fake artist has a hard time determining what the word is after being voted out. </p>
          </h1>
        </li>
        <li>
          <h1>One Night WereWolf
            <p>This game is much more straightforward than other games. Players each get 1 card at the beginning of the round, look at it and then put it down. Then 3 more random cards are drawn and put in the middle face-down. Then the announcer states that night time has begun, and instructs everyone to close their eyes. Then the announcer states that the werewolves open their eyes and look around. Then they close their eyes and the announcer states that seers open their eyes and look at another player’s card or 2 cards in the middle. Then the seers close their eyes and the announcer states that the robber opens their eyes and swaps his card out for another player’s card which the robber can look at. Then the robber closes their eyes and the announcer states that the troublemakers open their eyes and swap two players cards at random. Then the troublemakers close their eyes and the announcer states that everyone opens their eyes. After a period of time to discuss, everyone votes on who to eliminate. The village wins if just one werewolf dies, or if there are no werewolves and no one dies. The werewolves win if no werewolf dies and there is at least one werewolf. </p>
          </h1>
        </li>
        <li>
          <h1>Avalon
            <div>
              <a href='https://www.youtube.com/watch?v=4ZrInr9_BNg&ab_channel=BoardGameEmpire'>Video On How to Play</a>
            </div>
          </h1>
        </li>
      </ul>
    </div>

  );
}