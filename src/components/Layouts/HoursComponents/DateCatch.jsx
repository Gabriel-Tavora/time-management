import React from "react";
//css
import "../../../styles/dateCatch.css";
//components
import Input from "../../common/Inputs/Inputs.jsx";
const DateCatch = ({
  endDate,
  handleEndDateChange,
  startDate,
  handleStartDateChange,
  startTime,
  handleStartTimeChange,
  endTime,
  handleEndTimeChange,
}) => {
  return (
    <div className="date-catch">
      <div className="date-time">
        <Input
          classNameIn="commun-input"
          labelText="Data Inicial"
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => handleStartDateChange(e.target.value)}
          name="startDate"
        />

        <Input
          classNameIn="commun-input"
          labelText="Horário Inicial"
          id="startTime"
          type="time"
          value={startTime}
          onChange={(e) => handleStartTimeChange(e.target.value)}
          name="startTime"
        />
      </div>

      <div className="date-time">
        <Input
          classNameIn="commun-input"
          labelText="Data Final"
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => handleEndDateChange(e.target.value)}
          name="endDate"
        />

        <Input
          classNameIn="commun-input"
          labelText="Horário de Saída"
          id="endTime"
          type="time"
          value={endTime}
          onChange={(e) => handleEndTimeChange(e.target.value)}
          name="endTime"
        />
      </div>
    </div>
  );
};

export default DateCatch;