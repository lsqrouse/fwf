const Teams = require("./Teams");
const Abilities = require("./Ability");

class Villager extends RoleType {
  constructor() {
    super("distractor", Abilities.block, Teams.Mafia);
  }
}