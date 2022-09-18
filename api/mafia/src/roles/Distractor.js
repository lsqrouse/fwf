const Teams = require("./Teams");

class Villager extends RoleType {
  constructor() {
    super("distractor", null, Teams.Mafia);
  }
}