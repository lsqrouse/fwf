import DukeIcon from "../../images/coup/duke.png"
import CaptainIcon from "../../images/coup/captain.png"
import ContessaIcon from "../../images/coup/contessa.png"
import AssassinIcon from "../../images/coup/assassin.png"
import AmbassadorIcon from "../../images/coup/ambassador.png"

// Role list
const roles = 
[
  // First version
  [
    {id: 0, roleIcon: DukeIcon, canBePlayed: true, name: "Duke", image: "", coinAction: 3, pvp: false, abilityShort: "Take 3 coins", ability: "Take 3 coins from pot or stop a player from taking foreign aid"},
    {id: 1, roleIcon: CaptainIcon, canBePlayed: true, name: "Captain", image: "", coinAction: 2, pvp: true, abilityShort: "Steal 2 coins", ability: "Take 2 coins from a player or block a player from stealing"},
    {id: 2, roleIcon: ContessaIcon, canBePlayed: false, name: "Contessa", image: "", coinAction: 0, pvp: false, abilityShort: "Block an assassination", ability: "Block an assassination attempt"},
    {id: 3, roleIcon: AssassinIcon, canBePlayed: true, name: "Assassin", image: "", coinAction: -3, pvp: true, abilityShort: "Assassinate", ability: "Pay 3 coins to assassinate a player (eliminate one of their cards)"},
    {id: 4, roleIcon: AmbassadorIcon, canBePlayed: true, name: "Ambassador", image: "", coinAction: 0, pvp: false, abilityShort: "Get 2 new cards", ability: "Get 2 new random cards or block a player from stealing"},
  ],
  // Second version
  [
    {id: 0, roleIcon: DukeIcon, canBePlayed: true, name: "Duke", image: "", coinAction: 3, pvp: false, abilityShort: "Take 3 coins", ability: "Take 3 coins from pot or stop a player from taking foreign aid"},
    {id: 1, roleIcon: CaptainIcon, canBePlayed: true, name: "Captain", image: "", coinAction: 2, pvp: true, abilityShort: "Steal 2 coins", ability: "Take 2 coins from a player or block a player from stealing"},
    {id: 2, roleIcon: ContessaIcon, canBePlayed: false, name: "Contessa", image: "", coinAction: 0, pvp: false, abilityShort: "Block an assassination", ability: "Block an assassination attempt"},
    {id: 3, roleIcon: AssassinIcon, canBePlayed: true, name: "Assassin", image: "", coinAction: -3, pvp: true, abilityShort: "Assassinate", ability: "Pay 3 coins to assassinate a player (eliminate one of their cards)"},
    {id: 4, roleIcon: AmbassadorIcon, canBePlayed: true, name: "Ambassador", image: "", coinAction: 0, pvp: false, abilityShort: "Get 2 new cards", ability: "Get 2 new random cards or block a player from stealing"},
    {id: 5, roleIcon: DukeIcon, canBePlayed: true, name: "idk", image: "", coinAction: 0, pvp: false, abilityShort: "", ability: "hehe"},
  ],
  // Third version
  [
    {id: 0, roleIcon: DukeIcon, canBePlayed: true, name: "Duke", image: "", coinAction: 3, pvp: false, abilityShort: "Take 3 coins", ability: "Take 3 coins from pot or stop a player from taking foreign aid"},
    {id: 1, roleIcon: CaptainIcon, canBePlayed: true, name: "Captain", image: "", coinAction: 2, pvp: true, abilityShort: "Steal 2 coins", ability: "Take 2 coins from a player or block a player from stealing"},
    {id: 2, roleIcon: ContessaIcon, canBePlayed: false, name: "Contessa", image: "", coinAction: 0, pvp: false, abilityShort: "Block an assassination", ability: "Block an assassination attempt"},
    {id: 3, roleIcon: AssassinIcon, canBePlayed: true, name: "Assassin", image: "", coinAction: -3, pvp: true, abilityShort: "Assassinate", ability: "Pay 3 coins to assassinate a player (eliminate one of their cards)"},
    {id: 4, roleIcon: AmbassadorIcon, canBePlayed: true, name: "Ambassador", image: "", coinAction: 0, pvp: false, abilityShort: "Get 2 new cards", ability: "Get 2 new random cards or block a player from stealing"},
    {id: 5, roleIcon: DukeIcon, canBePlayed: true, name: "idk", coinAction: 0, pvp: false, image: "", abilityShort: "", ability: "hehe"},
    {id: 6, roleIcon: DukeIcon, canBePlayed: true, name: "stillidk", coinAction: 0, pvp: false, image: "", abilityShort: "", ability: "hehe"},
  ]
];

export default roles;