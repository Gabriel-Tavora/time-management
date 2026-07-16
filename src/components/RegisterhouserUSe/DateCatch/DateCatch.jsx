import React from "react";
//css
import "./DateCatch.css";

const DateCatch = ({
  workDate,
  setWorkDate,
  startTime,
  setStartTime,
  endTime,
  handleEndTimeChange,
}) => {
  return (
    <div className="time-menu-form-group">
      <div className="time-menu-group">
        <label htmlFor="workDate">Data do Trabalho</label>
        <input
          id="workDate"
          type="date"
          value={workDate}
          onChange={(e) => setWorkDate(e.target.value)}
          name="workDate"
        />
      </div>

      <div className="time-menu-group">
        <label htmlFor="startTime">Horário Inicial</label>
        <input
          id="startTime"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      <div className="time-menu-group">
        <label htmlFor="endTime">Horário de Saída</label>
        <input
          id="endTime"
          type="time"
          value={endTime}
          onChange={handleEndTimeChange}
        />
      </div>
    </div>
  );
};

export default DateCatch;
