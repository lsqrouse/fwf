// import DukeIcon from "../../images/coup/icons/duke.png";
// import CaptainIcon from "../../images/coup/icons/captain.pngfalse/ import ContessaIcon from "../../imagefalseup/icons/contessa.png";
// import AssassinIcon from "../../images/coup/icons/assassin.png"
// import AmbassadorIcon from "../../images/coup/icons/ambassador.png"

// Role list
const roles = 
[
  // First version
  [
    {id: 0, canBePlayed: true, name: "Duke", image: "", coinAction: 3, pvp: false, ability: "Take 3 coins from pot or stop a player from taking foreign aid"},
    {id: 1, canBePlayed: true, name: "Captain", image: "", coinAction: 2, pvp: true, ability: "Take 2 coins from a player (if they at least 2 coins already) or block a player from stealing"},
    {id: 2, canBePlayed: false, name: "Contessa", image: "", coinAction: 0, pvp: false, ability: "Block an assassination attempt"},
    {id: 3, canBePlayed: true, name: "Assassin", image: "", coinAction: -2, pvp: true, ability: "Pay 2 coins to assassinate a player (eliminate one of their cards)"},
    {id: 4, canBePlayed: true, name: "Ambassador", image: "", coinAction: 0, pvp: false, ability: "Get 2 new random cards or block a player from stealing"},
  ],
  // Second version
  [
    {id: 0, canBePlayed: true, name: "Duke", image: "", coinAction: 3, pvp: false, ability: "Take 3 coins from pot or stop a player from taking foreign aid"},
    {id: 1, canBePlayed: true, name: "Captain", image: "", coinAction: 2, pvp: true, ability: "Take 2 coins from a player (if they at least 2 coins already) or block a player from stealing"},
    {id: 2, canBePlayed: false, name: "Contessa", image: "", coinAction: 0, pvp: false, ability: "Block an assassination attempt"},
    {id: 3, canBePlayed: true, name: "Assassin", image: "", coinAction: -2, pvp: true, ability: "Pay 2 coins to assassinate a player (eliminate one of their cards)"},
    {id: 4, canBePlayed: true, name: "Ambassador", image: "", coinAction: 0, pvp: false, ability: "Get 2 new random cards or block a player from stealing"},
    {id: 5, canBePlayed: true, name: "idk", image: "", coinAction: 0, pvp: false, ability: "hehe"},
  ],
  // Third version
  [
    {id: 0, canBePlayed: true, name: "Duke", image: "", coinAction: 3, pvp: false, ability: "Take 3 coins from pot or stop a player from taking foreign aid"},
    {id: 1, canBePlayed: true, name: "Captain", image: "", coinAction: 2, pvp: true, ability: "Take 2 coins from a player (if they at least 2 coins already) or block a player from stealing"},
    {id: 2, canBePlayed: false, name: "Contessa", image: "", coinAction: 0, pvp: false, ability: "Block an assassination attempt"},
    {id: 3, canBePlayed: true, name: "Assassin", image: "", coinAction: -2, pvp: true, ability: "Pay 2 coins to assassinate a player (eliminate one of their cards)"},
    {id: 4, canBePlayed: true, name: "Ambassador", image: "", coinAction: 0, pvp: false, ability: "Get 2 new random cards or block a player from stealing"},
    {id: 5, canBePlayed: true, name: "idk", coinAction: 0, pvp: false, image: "", ability: "hehe"},
    {id: 6, canBePlayed: true, name: "stillidk", coinAction: 0, pvp: false, image: "", ability: "hehe"},
  ]
];

export default roles;