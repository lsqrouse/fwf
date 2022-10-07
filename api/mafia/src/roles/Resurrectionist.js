const Teams = require("./Teams");

class Resurrectionist extends RoleType {
  constructor() {
    super("resurrectionist", null, Teams.Village);
  }
}