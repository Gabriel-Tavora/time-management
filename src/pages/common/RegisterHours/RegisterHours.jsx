// RegisterHours.jsx
import React, { useEffect, useState } from "react";

import Sidebar from "../../../components/Layouts/SideBar/SideBar.jsx";
import DateCatch from "../../../components/Layouts/HoursComponents/DateCatch.jsx";
import RegisterInfo from "../../../components/Layouts/HoursComponents/RegisterInfo.jsx";
import TableHour from '../../../components/Layouts/HoursComponents/TableHour.jsx';

import "../../../styles/registerHours.css";
import "../../../styles/tables.css"

import { useAuthValue } from "../../../context/TokenContext";

import { getCurrentDate } from "../../../utils/formatHours.js";
import { isNightTime } from "../../../utils/editFormatTime.js";

import { useRegisterHours } from "../../../hooks/useOvertimeAndTimout/useRegisterHours.js";
import { useOvertimeRegistration } from "../../../hooks/useOvertimeAndTimout/useOvertimeRegistration.js";

const RegisterHours = () => {
  const {
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    nightTime,
    setNightTime,
    endDate,
    setEndDate,
    startDate,
    setStartDate,
  } = useRegisterHours();

  const [jiraTask, setJiraTask] = useState("");
  const [observation, setObservation] = useState("");
  const [entries, setEntries] = useState([]);

  const { token } = useAuthValue();

  const loadTodayDate = () => {
    const { formattedPost } = getCurrentDate();
    setEndDate(formattedPost);
    setStartDate(formattedPost);
  };

  useEffect(() => {
    loadTodayDate();
  }, []);

  const clearForm = () => {
    setStartTime("17:00");
    setEndTime("");
    setObservation("");
    setJiraTask("");
    setNightTime(false);
    loadTodayDate();
  };

  const form = {
    endTime,
    endDate,
    startTime,
    startDate,
    jiraTask,
    observation,
  };

  const handleRegisterSuccess = () => {
    setEntries((prev) => [
      ...prev,
      { ...form, id: `${Date.now()}-${prev.length}` },
    ]);
  };

  const { handleSubmit, message, isSubmitting } = useOvertimeRegistration({
    token,
    form,
    clearForm,
    onSuccess: handleRegisterSuccess,
  });

  const handleStartTimeChange = (value) => {
    setStartTime(value);
    setNightTime(isNightTime(value, endTime, startDate, endDate));
  };
  const handleEndTimeChange = (value) => {
    setEndTime(value);
    setNightTime(isNightTime(startTime, value, startDate, endDate));
  };
  const handleStartDateChange = (value) => {
    setStartDate(value);
    setNightTime(isNightTime(startTime, endTime, value, endDate));
  };
  const handleEndDateChange = (value) => {
    setEndDate(value);
    setNightTime(isNightTime(startTime, endTime, startDate, value));
  }

  const hasEntries = entries.length > 0;

  return (
    <div className="time-menu">
      <Sidebar />

      <div className="panel-menu">
        <aside className="add-time-menu">
          <div className="time-menu-container">
            <h1>Registrar Hora Extra</h1>

            <form className="time-menu-form" onSubmit={handleSubmit}>
              <DateCatch
                startDate={startDate}
                handleStartDateChange={handleStartDateChange}
                endDate={endDate}
                handleEndDateChange={handleEndDateChange}
                startTime={startTime}
                handleStartTimeChange={handleStartTimeChange}
                endTime={endTime}
                handleEndTimeChange={handleEndTimeChange}
              />

              {nightTime && (
                <div className="time-menu-night-alert">
                  🌙 Adicional noturno detectado
                </div>
              )}

              <RegisterInfo
                mode={"register"}
                jiraTask={jiraTask}
                observation={observation}
                onJiraTaskChange={(e) => setJiraTask(e.target.value)}
                onObservationChange={(e) => setObservation(e.target.value)}
                message={message}
                isSubmitting={isSubmitting}
              />
            </form>
          </div>
        </aside>

        <div>
          {hasEntries && <TableHour data={entries} />}
        </div>
      </div>
    </div>
  );
};

export default RegisterHours;