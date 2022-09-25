const Teams = require("./Teams");
const Abilities = require("./Ability");

class Distractor extends RoleType {
  constructor() {
    super("distractor", Abilities.block, Teams.Mafia);
  }
}