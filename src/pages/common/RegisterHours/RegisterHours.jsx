// React
import React, { useEffect, useState } from "react";

// Components
import Sidebar from "../../../components/Layouts/SideBar/SideBar.jsx";
import DateCatch from "../../../components/RegisterhouserUSe//DateCatch.jsx";
import RegisterInfo from "../../../components/RegisterhouserUSe//RegisterInfo.jsx";

// CSS
import "../../../styles/registerHours.css";

// Context
import { useAuthValue } from "../../../context/TokenContext";

// Utils
import { getCurrentDate } from "../../../utils/formatHours.js";
import { isNightTime } from "../../../utils/editFormatTime.js";

// Hooks
import { useRegisterHours } from "../../../hooks/useRegisterHours.js";
import { useOvertimeRegistration } from "../../../hooks/useOvertimeRegistration";

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

  const { handleSubmit, message, isSubmitting } = useOvertimeRegistration({
    token,
    form,
    clearForm,
  });

  const handleStartTimeChange = (value) => {
    setStartTime(value);
    setNightTime(isNightTime(value, endTime));
  };

  const handleEndTimeChange = (value) => {
    setEndTime(value);
    setNightTime(isNightTime(startTime, value));
  };

  return (
    <div className="time-menu">
      <Sidebar />

      <aside className="add-time-menu">
        <div className="time-menu-container">
          <h1>Registrar Hora Extra</h1>

          <form className="time-menu-form" onSubmit={handleSubmit}>
            <DateCatch
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              startTime={startTime}
              handleStartTimeChange={handleStartTimeChange}
              endTime={endTime}
              handleEndTimeChange={handleEndTimeChange}
            />

            {nightTime && (
              <div className="time-menu-night-alert">
                🌙 Horário noturno detectado
              </div>
            )}

            <RegisterInfo
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
    </div>
  );
};

export default RegisterHours;
