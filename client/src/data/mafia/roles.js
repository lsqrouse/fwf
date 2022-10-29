import PlayerIcon from "../../images/mafia/icons/player.png";
import VillagerIcon from "../../images/mafia/icons/villager.png";
import DetectiveIcon from "../../images/mafia/icons/detective.png";
import DoctorIcon from "../../images/mafia/icons/doctor.png";
import VigilanteIcon from "../../images/mafia/icons/vigilante.png"
import DrunkIcon from "../../images/mafia/icons/drunk.png"
import MafiaIcon from "../../images/mafia/icons/mafia.png";
import DistractorIcon from "../../images/mafia/icons/distractor.png"
import ExecutionerIcon from "../../images/mafia/icons/executioner.png";
import FramerIcon from "../../images/mafia/icons/framer.png";
import RessurectionistIcon from "../../images/mafia/icons/ressurectionist.png";
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
    abilities: "Vote with the other Mafia to kill someone at night!",
  },

  "Detective": {
    name: "Detective",
    image: DetectiveIcon,
    team: "Village",
    winCondition: `${teams.Village.winCondition}`,
    abilities: "Investigate someone to figure out their team.",
    abilityMessage: "Choose some to investigate tonight."
  },

  "Doctor": {
    name: "Doctor",
    image: DoctorIcon,
    team: "Village",
    winCondition: `${teams.Village.winCondition}`,
    abilities: "Protect someone from dying one night.",
    abilityMessage: "Choose someone to protect tonight."
  },

  "Vigilante": {
    name: "Vigilante",
    image: VigilanteIcon,
    team: "Village",
    winCondition: `${teams.Village.winCondition}`,
    abilities: "Use your gun to kill someone.",
    abilityMessage: "Choose someone to kill tonight."
  },

  "Drunk": {
    name: "Drunk",
    image: DrunkIcon,
    team: "Village",
    winCondition: `${teams.Village.winCondition}`, 
    abilities: "Block someone from using their ability. You are immune to being blocked.",
    abilityMessage: "Choose someone to block their ability tonight."
  },

  "Ressurectionist": {
    name: "Ressurectionist",
    image: RessurectionistIcon,
    team: "Village",
    winCondition: `${teams.Village.winCondition}`,
    abilities: "Once per game, bring one player from the graveyard back alive.",
    abilityMessage: "Choose someone ressurect tonight."
  },

  "Distractor": {
    name: "Distractor",
    image: DistractorIcon,
    team: "Mafia",
    winCondition: `${teams.Mafia.winCondition}`,
    abilities: "Block someone from using their ability. You are immune to being blocked.",
    abilityMessage: "Choose someone to block their ability tonight."
  },

  "Framer": {
    name: "Framer",
    image: FramerIcon,
    team: "Mafia",
    winCondition: `${teams.Mafia.winCondition}`,
    abilities: "Make someone appear as Mafia if they are investigated during the same night.",
    abilityMessage: "Choose someone to frame tonight."
  },

  "Executioner": {
    name: "Executioner",
    image: ExecutionerIcon,
    team: "Executioner",
    winCondition: `${teams.Executioner.winCondition}`,
    abilities: "None. But you know that your target is part of the Village."
  }
};

export default roles;