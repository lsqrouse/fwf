import DukeIcon from "../../images/coup/duke.png"
import CaptainIcon from "../../images/coup/captain.jpg" 
import ContessaIcon from "../../images/coup/contessa.jpg"
import AssassinIcon from "../../images/coup/assassin.png"
import AmbassadorIcon from "../../images/coup/ambassador.jpg"

// Role list
const roles = 
[
  // First version
  [
    {id: 0, roleIcon: DukeIcon, canBePlayed: true, name: "Duke", image: "", coinAction: 3, pvp: false, ability: "Take 3 coins from pot or stop a player from taking foreign aid"},
    {id: 1, roleIcon: CaptainIcon, canBePlayed: true, name: "Captain", image: "", coinAction: 2, pvp: true, ability: "Take 2 coins from a player (if they at least 2 coins already) or block a player from stealing"},
    {id: 2, roleIcon: ContessaIcon, canBePlayed: false, name: "Contessa", image: "", coinAction: 0, pvp: false, ability: "Block an assassination attempt"},
    {id: 3, roleIcon: AssassinIcon, canBePlayed: true, name: "Assassin", image: "", coinAction: -3, pvp: true, ability: "Pay 3 coins to assassinate a player (eliminate one of their cards)"},
    {id: 4, roleIcon: AmbassadorIcon, canBePlayed: true, name: "Ambassador", image: "", coinAction: 0, pvp: false, ability: "Get 2 new random cards or block a player from stealing"},
  ],
  // Second version
  [
    {id: 0, roleIcon: DukeIcon, canBePlayed: true, name: "Duke", image: "", coinAction: 3, pvp: false, ability: "Take 3 coins from pot or stop a player from taking foreign aid"},
    {id: 1, roleIcon: CaptainIcon, canBePlayed: true, name: "Captain", image: "", coinAction: 2, pvp: true, ability: "Take 2 coins from a player (if they at least 2 coins already) or block a player from stealing"},
    {id: 2, roleIcon: ContessaIcon, canBePlayed: false, name: "Contessa", image: "", coinAction: 0, pvp: false, ability: "Block an assassination attempt"},
    {id: 3, roleIcon: AssassinIcon, canBePlayed: true, name: "Assassin", image: "", coinAction: -3, pvp: true, ability: "Pay 3 coins to assassinate a player (eliminate one of their cards)"},
    {id: 4, roleIcon: AmbassadorIcon, canBePlayed: true, name: "Ambassador", image: "", coinAction: 0, pvp: false, ability: "Get 2 new random cards or block a player from stealing"},
    {id: 5, roleIcon: DukeIcon, canBePlayed: true, name: "idk", image: "", coinAction: 0, pvp: false, ability: "hehe"},
  ],
  // Third version
  [
    {id: 0, roleIcon: DukeIcon, canBePlayed: true, name: "Duke", image: "", coinAction: 3, pvp: false, ability: "Take 3 coins from pot or stop a player from taking foreign aid"},
    {id: 1, roleIcon: CaptainIcon, canBePlayed: true, name: "Captain", image: "", coinAction: 2, pvp: true, ability: "Take 2 coins from a player (if they at least 2 coins already) or block a player from stealing"},
    {id: 2, roleIcon: ContessaIcon, canBePlayed: false, name: "Contessa", image: "", coinAction: 0, pvp: false, ability: "Block an assassination attempt"},
    {id: 3, roleIcon: AssassinIcon, canBePlayed: true, name: "Assassin", image: "", coinAction: -3, pvp: true, ability: "Pay 3 coins to assassinate a player (eliminate one of their cards)"},
    {id: 4, roleIcon: AmbassadorIcon, canBePlayed: true, name: "Ambassador", image: "", coinAction: 0, pvp: false, ability: "Get 2 new random cards or block a player from stealing"},
    {id: 5, roleIcon: DukeIcon, canBePlayed: true, name: "idk", coinAction: 0, pvp: false, image: "", ability: "hehe"},
    {id: 6, roleIcon: DukeIcon, canBePlayed: true, name: "stillidk", coinAction: 0, pvp: false, image: "", ability: "hehe"},
  ]
];

export default roles;