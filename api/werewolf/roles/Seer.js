const Teams = require("./Teams");

class Seer extends RoleType {
  constructor() {
    super("seer", null, Teams.Village);
  }
}