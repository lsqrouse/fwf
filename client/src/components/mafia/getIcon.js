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

const icons = {
  "villager": VillagerIcon,
  "detective": DetectiveIcon,
  "doctor": DoctorIcon,
  "vigilante": VigilanteIcon,
  "drunk": DrunkIcon,
  "swapper": SwapperIcon,
  "mafia": MafiaIcon,
  "distractor": DistractorIcon,
  "executioner": ExecutionerIcon,
  "framer": FramerIcon,
  "informant": InformantIcon,
  "ressurectionist": RessurectionistIcon,
  "bomb": BombIcon,
  "jester": JesterIcon
};

export function getIcon(roleName) {
  if (icons.hasOwnProperty(roleName.toLowerCase())) {
    return icons[roleName.toLowerCase()];
  }
  return PlayerIcon;
  //return "../images/mafia/icons/" + roleName.toLowerCase() + ".png";
}