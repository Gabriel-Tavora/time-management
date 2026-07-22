//react
import React, { useState, useEffect } from "react";
//components
import Sidebar from "../../../components/SideBar/SideBar.jsx";
import DateCatch from "../../../components/RegisterhouserUSe/DateCatch/DateCatch.jsx";
import RegisterInfo from "../../../components/RegisterhouserUSe/RegisterInfo/RegisterInfo.jsx";
//css
import "./RegisterHours.css";
//services
import { createOvertime } from "../../../services/overtimeData.js";
//context
import { useAuthValue } from "../../../context/TokenContext";
//Utils
import {
  getCurrentDate,
  formatHours,
  formatDataSend,
} from "../../../utils/formatHours.js";
//hooks
import { useRegisterHours } from "../../../hooks/useRegisterHours.js";

const RegisterHours = () => {
  const {
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    nightTime,
    setNightTime,
    workDate,
    setWorkDate,
  } = useRegisterHours();
  const [jiraTask, setJiraTask] = useState("");
  const [observation, setObservation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const { token } = useAuthValue();

  useEffect(() => {
    const { formattedPost } = getCurrentDate();
    setWorkDate(formattedPost);

  }, []);

  const handleEndTimeChange = (e) => {
    const value = e.target.value;

    setEndTime(value);
    setNightTime(value >= "22:00");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!endTime) {
      setMessage({
        type: "error",
        text: "Informe o horário de saída!",
      });
      return;
    }

    if (endTime <= startTime) {
      setMessage({
        type: "error",
        text: "O horário de saída deve ser depois do horário inicial.",
      });
      return;
    }
    if(!jiraTask){
      setMessage({
        type: "error",
        text: "Código Jira necessário para registrar hora extra! ",
      });
      return;
    }
    try {
      setIsSubmitting(true);
      const overtimeData = {
        work_date: formatDataSend(workDate),
        start_time: formatDataSend(workDate, startTime),
        end_time: formatDataSend(workDate, endTime),
        jira_task_identifier: jiraTask,
      };
      console.log(overtimeData);

      await createOvertime(token, overtimeData);

      setMessage({
        type: "success",
        text: "Hora extra registrada com sucesso!",
      });

      setEndTime("");
      setObservation("");
      setNightTime(false);
    } catch (err) {
      console.error(err);

      setMessage({
        type: "error",
        text: "Erro ao registrar. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="time-menu">
      <Sidebar />

      <aside className="add-time-menu">
        <div className="time-menu-container">
          <h1>Registrar Hora Extra</h1>

          <form className="time-menu-form" onSubmit={handleSubmit}>
            <DateCatch
              workDate={workDate}
              setWorkDate={setWorkDate}
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
