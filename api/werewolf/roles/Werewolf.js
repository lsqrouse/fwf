const Teams = require("./Teams");

class Werewolf extends RoleType {
  constructor() {
    super("werewolf", null, Teams.Werewolf);
  }
}