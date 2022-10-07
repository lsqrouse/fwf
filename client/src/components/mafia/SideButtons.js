import "../../styles/mafia/SideButtons.css"

function ChatButton() {
  return (
    <button type="button" className="sideButton" id="chatButton"></button>
  );
}

function VoteButton() {
  return (
    <button type="button" className="sideButton" id="voteButton"></button>
  );
}

function AbilityButton() {
  return (
    <button type="button" className="sideButton" id="abilityButton"></button>
  );
}

function NotesButton() {
  return (
    <button type="button" className="sideButton" id="notesButton"></button>
  );
}

function AlertsButton() {
  return (
    <button type="button" className="sideButton" id="alertsButton"></button>
  );
}

function AliveButton() {
  return (
    <button type="button" className="sideButton" id="aliveButton"></button>
  );
}

function DeadButton() {
  return (
    <button type="button" className="sideButton" id="deadButton"></button>
  );
}

export {
  ChatButton,
  VoteButton,
  AbilityButton,
  NotesButton,
  AlertsButton,
  AliveButton,
  DeadButton
}