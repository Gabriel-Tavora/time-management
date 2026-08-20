import React from "react";
import "./EditDate.css";
import Input from "../../Layouts/Inputs/Inputs.jsx";

const EditDate = ({
  endDate,
  setEndDate,
  startDate,
  setStartDate,
  startTime,
  handleStartTimeChange,
  endTime,
  handleEndTimeChange,
}) => {
  return (
    <div className="input-time">
      <div className="date-time">
        <Input
          classNameIn="commun-input"
          labelText="Data Inicial"
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
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
          onChange={(e) => setEndDate(e.target.value)}
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

export default EditDate;