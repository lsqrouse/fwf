// import DukeIcon from "../../images/coup/icons/duke.png";
// import CaptainIcon from "../../images/coup/icons/captain.png";
// import ContessaIcon from "../../images/coup/icons/contessa.png";
// import AssassinIcon from "../../images/coup/icons/assassin.png"
// import AmbassadorIcon from "../../images/coup/icons/ambassador.png"

// Role list
const roles = 
[
  // First version
  [
    {id: 0, name: "Duke", image: "", coinAction: 3, pvp: false, ability: "Take 3 coins from pot or stop a player from taking foreign aid"},
    {id: 1, name: "Captain", image: "", coinAction: 2, pvp: true, ability: "Take 2 coins from a player or block a player from stealing"},
    {id: 2, name: "Contessa", image: "", coinAction: 0, pvp: false, ability: "Block an assassination attempt"},
    {id: 3, name: "Assassin", image: "", coinAction: -2, pvp: true, ability: "Pay 2 coins to assassinate a player (eliminate one of their cards)"},
    {id: 4, name: "Ambassador", image: "", coinAction: 0, pvp: false, ability: "Get 2 new random cards or block a player from stealing"},
  ],
  // Second version
  [
    {id: 0, name: "Duke", image: "", coinAction: 3, pvp: false, ability: "Take 3 coins from pot or stop a player from taking foreign aid"},
    {id: 1, name: "Captain", image: "", coinAction: 2, pvp: true, ability: "Take 2 coins from a player or block a player from stealing"},
    {id: 2, name: "Contessa", image: "", coinAction: 0, pvp: false, ability: "Block an assassination attempt"},
    {id: 3, name: "Assassin", image: "", coinAction: -2, pvp: true, ability: "Pay 2 coins to assassinate a player (eliminate one of their cards)"},
    {id: 4, name: "Ambassador", image: "", coinAction: 0, pvp: false, ability: "Get 2 new random cards or block a player from stealing"},
    {id: 5, name: "idk", image: "", coinAction: 0, pvp: false, ability: "hehe"},
  ],
  // Third version
  [
    {id: 0, name: "Duke", image: "", coinAction: 3, pvp: false, ability: "Take 3 coins from pot or stop a player from taking foreign aid"},
    {id: 1, name: "Captain", image: "", coinAction: 2, pvp: true, ability: "Take 2 coins from a player or block a player from stealing"},
    {id: 2, name: "Contessa", image: "", coinAction: 0, pvp: false, ability: "Block an assassination attempt"},
    {id: 3, name: "Assassin", image: "", coinAction: -2, pvp: true, ability: "Pay 2 coins to assassinate a player (eliminate one of their cards)"},
    {id: 4, name: "Ambassador", image: "", coinAction: 0, pvp: false, ability: "Get 2 new random cards or block a player from stealing"},
    {id: 5, name: "idk", coinAction: 0, pvp: false, image: "", ability: "hehe"},
    {id: 6, name: "stillidk", coinAction: 0, pvp: false, image: "", ability: "hehe"},
  ]
];

export default roles;