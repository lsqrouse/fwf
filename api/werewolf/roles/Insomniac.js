const Teams = require("./Teams");

class Insomniac extends RoleType {
  constructor() {
    super("insomniac", null, Teams.Village);
  }
}