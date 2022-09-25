const Teams = require("./Teams");
const Abilities = require("./Ability");

class Bomb extends RoleType {
  constructor() {
    super("bomb", Abilities.bomb, Teams.Village);
  }
}