const Teams = require("./Teams");

class Villager extends RoleType {
  constructor() {
    super("villager", null, Teams.Village);
  }
}