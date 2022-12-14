import { useState } from "react";
import { getIcon } from "./getIcon";

function RoleCard(props) {
  const role = props.role;
  const [open, setOpen] = useState(false);

  if (open) {
    return <RoleCardOpen role={role} setOpen={setOpen} />;
  } else {
    return <RoleCardTab setOpen={setOpen} />;
  }
}

function RoleCardOpen(props) {
  const role = props.role;
  const setOpen = props.setOpen;

  function closeCard() {
    setOpen(false);
  }

  return (
    <div className="roleCard" onClick={closeCard}>
      <div className="roleLabel">
        ROLE
      </div>
      <img src={getIcon(role.name)} alt={role.name} />
      <h1>{role.name}</h1>
      <hr />
      <p><b>Team:</b> {role.team}</p>
      <p><b>Win Condition:</b> {role.winCondition}</p>
      {role.abilitiesDesc && <p><b>Abilities:</b> {role.abilitiesDesc}</p>}
      <div className="tapToHideLabel">
        TAP TO HIDE
      </div>
    </div>
  );
}

function RoleCardTab(props) {
  const setOpen = props.setOpen;

  function openCard() {
    setOpen(true);
  }

  return (
    <div className="roleCardTab" onClick={openCard}>
      ROLE
    </div>
  );
}

export default RoleCard;