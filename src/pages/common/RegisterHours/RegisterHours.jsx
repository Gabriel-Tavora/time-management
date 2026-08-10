// React
import React, { useEffect, useState } from "react";

// Components
import Sidebar from "../../../components/Layouts/SideBar/SideBar.jsx";
import DateCatch from "../../../components/RegisterhouserUSe/DateCatch/DateCatch.jsx";
import RegisterInfo from "../../../components/RegisterhouserUSe/RegisterInfo/RegisterInfo.jsx";

// CSS
import "./RegisterHours.css";

// Context
import { useAuthValue } from "../../../context/TokenContext";

// Utils
import { getCurrentDate } from "../../../utils/formatHours.js";

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
    setEndTime("");
    setObservation("");
    setJiraTask("");
    setNightTime(false);
    loadTodayDate();
  };

  const form = {
    endDate,
    startDate,
    startTime,
    endTime,
    jiraTask,
    observation,
  };

  const { handleSubmit, message, isSubmitting } = useOvertimeRegistration({
    token,
    form,
    clearForm,
  });

  const handleEndTimeChange = (e) => {
    const value = e.target.value;

    setEndTime(value);
    setNightTime(value >= "22:00");
  };

  return (
    <div className="time-menu">
      <Sidebar />

      <aside className="add-time-menu">
        <div className="time-menu-container">
          <h1>Registrar Hora Extra</h1>

          <form className="time-menu-form" onSubmit={handleSubmit}>
            <DateCatch
              endDate={endDate}
              setEndDate={setEndDate}
              startDate={startDate}
              setStartDate={setStartDate}
              startTime={startTime}
              setStartTime={setStartTime}
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
