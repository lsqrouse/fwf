const Teams = require("./Teams");
const Abilities = require("./Ability");

class Vigilante extends RoleType {
  constructor() {
    super("vigilante", Abilities.kill, Teams.Village);
  }
}