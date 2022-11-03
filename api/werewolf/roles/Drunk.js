const Teams = require("./Teams");

class Drunk extends RoleType {
  constructor() {
    super("drunk", null, Teams.Special);
  }
}