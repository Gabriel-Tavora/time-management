// React
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Components
import Sidebar from "../../../components/Layouts/SideBar/SideBar.jsx";
import EditDate from "../../../components/EditHoursInput/EditDate/EditDate.jsx";
import SendEditData from "../../../components/EditHoursInput/SendEditData/SendEditData.jsx";

// CSS
import "../../../styles/registerHours.css";

// Context
import { useAuthValue } from "../../../context/TokenContext.jsx";

// Utils
import { getCurrentDate } from "../../../utils/formatHours.js";
import {
  formatTimeForInput,
  formatDateForInput,
  isNightTime,
} from "../../../utils/editFormatTime.js";

// Hooks
import { useRegisterHours } from "../../../hooks/useRegisterHours.js";
import { useOvertimeEdit } from "../../../hooks/useOvertimeEdit.js";

const EditHours = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const overtime = location.state?.overtime;

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

  useEffect(() => {
    if (!overtime) {
      navigate("/userscreen", { replace: true });
      return;
    }

    const start = formatTimeForInput(overtime.start_time);
    const end = formatTimeForInput(overtime.end_time);
    const startDateValue = formatDateForInput(overtime.start_time);
    const endDateValue = formatDateForInput(overtime.end_time);

    setStartTime(start);
    setEndTime(end);
    setStartDate(startDateValue);
    setEndDate(endDateValue);
    setJiraTask(overtime.jira_task_identifier || "");
    setObservation(overtime.observation || "");
    setNightTime(isNightTime(start, end));
  }, [
    overtime,
    navigate,
    setStartTime,
    setEndTime,
    setStartDate,
    setEndDate,
    setNightTime,
  ]);

  const form = {
    overtimeId: overtime?.id,
    startTime,
    endTime,
    startDate,
    endDate,
    jiraTask,
    observation,
  };

  const { handleSubmit, message, isSubmitting, isRedirecting } =
    useOvertimeEdit({
      token,
      form,
      overtime,
      onSuccess: () => navigate("/userscreen"),
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
          <h1>Editar Hora Extra</h1>
          <form className="time-menu-form" onSubmit={handleSubmit}>
            <EditDate
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

            <SendEditData
              jiraTask={jiraTask}
              observation={observation}
              onJiraTaskChange={(e) => setJiraTask(e.target.value)}
              onObservationChange={(e) => setObservation(e.target.value)}
              message={message}
              isSubmitting={isSubmitting}
              isRedirecting={isRedirecting}
            />
          </form>
        </div>
      </aside>
    </div>
  );
};

export default EditHours;
