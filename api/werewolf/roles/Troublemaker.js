const Teams = require("./Teams");

class Troublemaker extends RoleType {
  constructor() {
    super("troublemaker", null, Teams.Village);
  }
}