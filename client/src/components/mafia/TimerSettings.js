function TimerSettings(props) {

  return (
    <div className="timerSettings">
      <p>
        Optionally set time limits for the day and night time phases. Setting to 0 or lower puts no limit.
      </p>
      <input type="text" id="dayPhaseTimeInput" className="timeInput mafiaInput1"></input>
      <button className="mafiaButton2" onClick={() => {
        var fname = document.getElementById("dayPhaseTimeInput");
        var time = fname.value;
        //handleDayPhaseTime(time);
      }}>Set day phase time in seconds </button>
      <br />
      <input type="text" id="nightPhaseTimeInput" className="timeInput mafiaInput1"></input>
      <button className="mafiaButton2" onClick={() => {
        var fname = document.getElementById("nightPhaseTimeInput");
        var time = fname.value;
        //handleNightPhaseTime(time);
      }}>Set night phase time in seconds </button>
    </div>
  );
}

export default TimerSettings;