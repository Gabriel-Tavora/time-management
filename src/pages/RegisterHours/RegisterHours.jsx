//react
import React, { useState, useEffect } from "react";
//components
import Sidebar from "../../components/SideBar/SideBar.jsx";
//css
import "./RegisterHours.css";
import { FaPlus } from "react-icons/fa";
//services
import { createOvertime } from "../../services/overtimeService";
//context
import { useAuthValue } from "../../context/TokenContext";
const RegisterHours = () => {
  const [startTime, setStartTime] = useState("17:00");
  const [endTime, setEndTime] = useState("");
  const [nightTime, setNightTime] = useState(false);
  const [workDate, setWorkDate] = useState("");
  const [observation, setObservation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const { token } = useAuthValue();

  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setWorkDate(getCurrentDate());
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

    try {
      setIsSubmitting(true);

      const overtimeData = {
        work_date: `${workDate}T00:00:00Z`,
        start_time: `${workDate}T${startTime}:00Z`,
        end_time: `${workDate}T${endTime}:00Z`,
        jira_task_identifier: observation,
      };

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

            {nightTime && (
              <div className="time-menu-night-alert">
                🌙 Horário noturno detectado
              </div>
            )}

            <div className="time-menu-send">
              <div className="time-menu-send-obs">
                <label htmlFor="observation">Observação:</label>
                <textarea
                  id="observation"
                  name="observation"
                  rows="4"
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="Descreva o motivo da hora extra (opcional)"
                />
              </div>

              {message && (
                <p
                  className={`time-menu-message time-menu-message-${message.type}`}
                >
                  {message.text}
                </p>
              )}

              <button
                type="submit"
                className="time-menu-send-btn"
                disabled={isSubmitting}
              >
                <FaPlus className="src" />
                {isSubmitting ? "Registrando..." : "Registrar Hora Extra"}
              </button>
            </div>
          </form>
        </div>
      </aside>
    </div>
  );
};

export default RegisterHours;
