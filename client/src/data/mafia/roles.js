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

const winConditions = {
  Village: "Stop the Mafia from killing the Village!",
  Mafia: "Eliminate the Village before they eliminate you and the other Mafia!",
  Jester: "Get voted out, whatever the cost!",
  Executioner: "Get your target voted out, whatever the cost!"
}

const roles = [
  { name: "Villager", image: VillagerIcon, team: "Village", winCondition: `${winConditions.Village}`},
  { name: "Mafia", image: MafiaIcon, team: "Mafia", winCondition: `${winConditions.Mafia}`, abilities: "Vote with the other Mafia to kill someone at night!" },
  { name: "Detective", image: DetectiveIcon, team: "Village", winCondition: `${winConditions.Village}`, abilities: "Investigate someone to figure out their team." },
  { name: "Doctor", image: DoctorIcon, team: "Village", winCondition: `${winConditions.Village}`, abilitie: "Protect someone from dying one night." },
  { name: "Vigilante", image: VigilanteIcon, team: "Village", winCondition: `${winConditions.Village}`, abilities: "Use your gun to kill someone."},
  { name: "Drunk", image: DrunkIcon, team: "Village", winCondition: `${winConditions.Village}`, abilities: "Block someone from using their ability. You are immune to being blocked." },
  { name: "Distractor", image: DistractorIcon, team: "Mafia", winCondition: `${winConditions.Mafia}`, abilities: "Block someone from using their ability. You are immune to being blocked." },
  { name: "Executioner", image: ExecutionerIcon, team: "Executioner", winCondition: `${winConditions.Executioner}`, abilities: "None. But you know that your target is part of the Village." },
  { name: "Framer", image: FramerIcon, team: "Mafia", winCondition: `${winConditions.Mafia}`, abilities: "Make someone appear as Mafia if they are investigated during the same night." },
  { name: "Ressurectionist", image: RessurectionistIcon, team: "Village", winCondition: `${winConditions.Village}`, abilities: "Once per game, bring one player from the graveyard back alive." }
];

export default roles;