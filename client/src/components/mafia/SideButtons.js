import "../../styles/mafia/SideButtons.css"

function ChatButton(props) {
  const setScreen = () => { props.setScreen("chat") }
  return (
    <button type="button" className="sideButton" id="chatButton" onClick={setScreen}></button>
  );
}

function VoteButton(props) {
  const setScreen = () => { props.setScreen("vote") }
  return (
    <button type="button" className="sideButton" id="voteButton" onClick={setScreen}></button>
  );
}

function AbilityButton(props) {
  const setScreen = () => { props.setScreen("ability") }
  return (
    <button type="button" className="sideButton" id="abilityButton" onClick={setScreen}></button>
  );
}

function NotesButton(props) {
  const setScreen = () => { props.setScreen("notes") }
  return (
    <button type="button" className="sideButton" id="notesButton" onClick={setScreen}></button>
  );
}

function AlertsButton(props) {
  const setScreen = () => { props.setScreen("alerts") }
  return (
    <button type="button" className="sideButton" id="alertsButton" onClick={setScreen}></button>
  );
}

function AliveButton(props) {
  const setScreen = () => { props.setScreen("aliveList") }
  return (
    <button type="button" className="sideButton" id="aliveButton" onClick={setScreen}></button>
  );
}

function DeadButton(props) {
  const setScreen = () => { props.setScreen("deadList") }
  return (
    <button type="button" className="sideButton" id="deadButton" onClick={setScreen}></button>
  );
}

function MafiaButton(props) {
  const setScreen = () => { props.setScreen("mafiaList") }
  return (
    <button type="button" className="sideButton" id="mafiaButton" onClick={setScreen}></button>
  );
}

export {
  ChatButton,
  VoteButton,
  AbilityButton,
  NotesButton,
  AlertsButton,
  AliveButton,
  DeadButton,
  MafiaButton
}