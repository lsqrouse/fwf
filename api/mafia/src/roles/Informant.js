const Teams = require("./Teams");
const Abilities = require("./Ability");

class Villager extends RoleType {
  constructor() {
    super("informant", Abilities.investigate, Teams.Mafia);
  }
}