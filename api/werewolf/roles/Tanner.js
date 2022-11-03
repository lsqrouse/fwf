const Teams = require("./Teams");

class Tanner extends RoleType {
  constructor() {
    super("tanner", null, Teams.Special);
  }
}