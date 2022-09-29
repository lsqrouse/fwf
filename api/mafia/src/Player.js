class Player {
  constructor(userId, role) {
    this.userId = userId;
    this.role = role;
  }

  getMafiaList()
  {
    // If mafia return list
    if (this.role == "Mafia")
    {
      // Initialize mafia list
      mafiaList = []

      // Get from game

      // Return list of players who are mafia
      return mafiaList;
    }
    // Else return empty list
    else
    {
      return [];
    }
  }
}