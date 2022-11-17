import PlayerIcon from "../../images/mafia/icons/player.png";
import VillagerIcon from "../../images/mafia/icons/villager.png";
import DetectiveIcon from "../../images/mafia/icons/detective.png";
import DoctorIcon from "../../images/mafia/icons/doctor.png";
import VigilanteIcon from "../../images/mafia/icons/vigilante.png";
import DrunkIcon from "../../images/mafia/icons/drunk.png";
import SwapperIcon from "../../images/mafia/icons/swapper.png";
import MafiaIcon from "../../images/mafia/icons/mafia.png";
import DistractorIcon from "../../images/mafia/icons/distractor.png"
import ExecutionerIcon from "../../images/mafia/icons/executioner.png";
import FramerIcon from "../../images/mafia/icons/framer.png";
import InformantIcon from "../../images/mafia/icons/informant.png";
import RessurectionistIcon from "../../images/mafia/icons/ressurectionist.png";
import BombIcon from "../../images/mafia/icons/bomb.png";
import JesterIcon from "../../images/mafia/icons/jester.png";
import teams from "./teams";

const roles = {
  "Villager": {
    name: "Villager",
    image: VillagerIcon,
    team: "Village",
    winCondition: `${teams.Village.winCondition}`
  },

  "Mafia": {
    name: "Mafia", image: MafiaIcon,
    team: "Mafia", winCondition: `${teams.Mafia.winCondition}`,
    abilitiesDesc: "Vote with the other Mafia to kill someone at night!",
  },

  "Detective": {
    name: "Detective",
    image: DetectiveIcon,
    team: "Village",
    winCondition: `${teams.Village.winCondition}`,
    ability: "investigate",
    abilitiesDesc: "Investigate someone to figure out their team.",
    abilityMessage: "Choose some to investigate tonight."
  },

  "Doctor": {
    name: "Doctor",
    image: DoctorIcon,
    team: "Village",
    winCondition: `${teams.Village.winCondition}`,
    ability: "save",
    abilitiesDesc: "Protect someone from dying one night.",
    abilityMessage: "Choose someone to protect tonight."
  },

  "Vigilante": {
    name: "Vigilante",
    image: VigilanteIcon,
    team: "Village",
    winCondition: `${teams.Village.winCondition}`,
    ability: "kill",
    abilitiesDesc: "Use your gun to kill someone.",
    abilityMessage: "Choose someone to kill tonight."
  },

  "Drunk": {
    name: "Drunk",
    image: DrunkIcon,
    team: "Village",
    winCondition: `${teams.Village.winCondition}`,
    ability: "block",
    abilitiesDesc: "Block someone from using their ability. You are immune to being blocked.",
    abilityMessage: "Choose someone to block their ability tonight."
  },

  "Swapper": {
    name: "Swapper",
    image: SwapperIcon,
    team: "Village",
    winCondition: `${teams.Village.winCondition}`,
    ability: "swap",
    abilitiesDesc: "Swap two players (can include yourself). Anyone who targets the first player will target the second player, and anyone who targets the second player will target the first player.",
    abilityMessage: "Choose two players to swap tonight."
  },

  "Ressurectionist": {
    name: "Ressurectionist",
    image: RessurectionistIcon,
    team: "Village",
    winCondition: `${teams.Village.winCondition}`,
    ability: "ressurect",
    abilitiesDesc: "Once per game, bring one player from the graveyard back alive.",
    abilityMessage: "Choose someone to ressurect tonight."
  },

  "Bomb": {
    name: "Bomb",
    image: BombIcon,
    team: "Village",
    winCondition: `${teams.Village.winCondition}`,
    abilitiesDesc: "If you get killed at night, you explode and take down your attacker with you.",
  },

  "Distractor": {
    name: "Distractor",
    image: DistractorIcon,
    team: "Mafia",
    winCondition: `${teams.Mafia.winCondition}`,
    ability: "block",
    abilitiesDesc: "Block someone from using their ability. You are immune to being blocked.",
    abilityMessage: "Choose someone to block their ability tonight."
  },

  "Framer": {
    name: "Framer",
    image: FramerIcon,
    team: "Mafia",
    winCondition: `${teams.Mafia.winCondition}`,
    ability: "frame",
    abilitiesDesc: "Make someone appear as Mafia if they are investigated during the same night.",
    abilityMessage: "Choose someone to frame tonight."
  },

  "Informant": {
    name: "Informant",
    image: InformantIcon,
    team: "Mafia",
    winCondition: `${teams.Mafia.winCondition}`,
    ability: "identify",
    abilitiesDesc: "Make someone appear as Mafia if they are investigated during the same night.",
    abilityMessage: "Choose someone to investigate."
  },

  "Jester": {
    name: "Jester",
    image: JesterIcon,
    team: "Jester",
    winCondition: `${teams.Jester.winCondition}`,
  },

  "Executioner": {
    name: "Executioner",
    image: ExecutionerIcon,
    team: "Executioner",
    winCondition: `${teams.Executioner.winCondition}`,
    abilitiesDesc: "None. But you know that your target is part of the Village."
  }
};

export default roles;