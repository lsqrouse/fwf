const Teams = require("./Teams");
const Abilities = require("./Ability");

class Informant extends RoleType {
  constructor() {
    super("informant", Abilities.investigate, Teams.Mafia);
  }
}