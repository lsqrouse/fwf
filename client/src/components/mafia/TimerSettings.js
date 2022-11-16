function TimerSettings(props) {

  return (
    <div className="timerSettings">
      <input type="text" name="frameName" className="timeInput mafiaInput1"></input>
        <button className="mafiaButton2" onClick={() => {
          var fname = document.getElementById("dayTime");
          var time = fname.value;
          //handleDayPhaseTime(time);
        }}>Set day phase time in seconds </button>

        <input type="text" name="frameName" className="timeInput mafiaInput1"></input>
        <button className="mafiaButton2" onClick={() => {
          var fname = document.getElementById("nightPhaseTime");
          var time = fname.value;
          //handleNightPhaseTime(time);
        }}>Set night phase time in seconds </button>
    </div>
  );
}

export default TimerSettings;