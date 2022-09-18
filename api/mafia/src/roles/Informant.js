const Teams = require("./Teams");

class Villager extends RoleType {
  constructor() {
    super("informant", null, Teams.Mafia);
  }
}