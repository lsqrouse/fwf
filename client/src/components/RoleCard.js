function RoleCard(props) {
  if (props.role) {
    
  }

  return (
    <div class="roleCard">
      ROLE CARD
      <img src={props.role.image} alt={props.role.name} />
      <span class="roleCardTitle">{props.role.name}</span>
      <p>props.role.team</p>
      <p><b>Win Condition:</b> {props.role.winCondition}</p>
    </div>
  );
}