const Teams = require("./Teams");

class Villager extends RoleType {
  constructor() {
    super("drunk", null, Teams.Villager);
  }
}