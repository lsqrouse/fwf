const Teams = require("./Teams");

class Robber extends RoleType {
  constructor() {
    super("robber", null, Teams.Village);
  }
}