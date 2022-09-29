const Teams = require("./Teams");
const Abilities = require("./Ability");

class Drunk extends RoleType {
  constructor() {
    super("drunk", Abilities.block, Teams.Villager);
  }
}

