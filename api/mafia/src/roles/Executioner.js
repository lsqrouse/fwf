const Teams = require("./Teams");

class Executioner extends RoleType {
  constructor() {
    super("executioner", null, Teams.Executioner);
  }
}