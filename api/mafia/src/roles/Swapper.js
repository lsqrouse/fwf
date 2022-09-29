const Teams = require("./Teams");
const Abilities = require("./Ability");

class Swapper extends RoleType {
  constructor() {
    super("swapper", Abilities.swap, Teams.Village);
  }
}