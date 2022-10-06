function RoleCard(props) {
  return (
    <div class="roleCard">
      <div class="role">
        ROLE
      </div>
      <img src={props.role.image} alt={props.role.name} />
      <span class="roleCardTitle">{props.role.name}</span>
      <p><b>Team:</b> {props.role.team}</p>
      <p><b>Win Condition:</b> {props.role.winCondition}</p>
      <p><b>Actions:</b> {props.role.actions}</p>
      <div class="bottom">
        TAP TO HIDE
      </div>
    </div>
  );
}



export default RoleCard;