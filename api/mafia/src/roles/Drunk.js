const Teams = require("./Teams");
const Abilities = require("./Ability");

class Villager extends RoleType {
  constructor() {
    super("drunk", Abilities.block, Teams.Villager);
  }
}

