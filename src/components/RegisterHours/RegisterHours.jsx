import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import Sidebar from "../../components/SideBar/SideBar.jsx";
import "./RegisterHours.css";

const RegisterHours = () => {
  const [startTime, setStartTime] = useState("17:00");
  const [endTime, setEndTime] = useState("");
  const [nightTime, setNightTime] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const currentdate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setCurrentTime(currentdate());
  }, []);
  const HandleBaseTime = (e) => {
    e.preventDefault();

    const data = {
      startTime,
      endTime,
      nightTime,
      currentTime,
    };

    console.log(data);
  };

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
          <h1>Registrar Hora Extra </h1>

          <form className="time-menu-form" onSubmit={HandleBaseTime}>
            <div className="time-menu-form-group">
              <div className="time-menu-group">
                <label for="currentTime">Data do Trabalho</label>
                <input
                  id="currentTime"
                  type="date"
                  value={currentTime}
                  name="workDate" />
              </div>

              <div className="time-menu-group">
                <label for="startTime">Horário Inicial</label>
                <input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className="time-menu-group">
                <label for="endTime">Horário de Saída</label>
                <input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={handleEndTimeChange}
                />
              </div>
            </div>

            <div className="time-menu-send">
              <div className="time-menu-send-obs">
                <label htmlFor="observation" style={{ cursor: "pointer" }}>
                  Observação:
                </label>
                <textarea id="observation" name="observation" rows="4" />
              </div>

              <button type="submit" className="time-menu-send-btn">
                <FaPlus className="src" />
                Registrar Hora Extra
              </button>
            </div>
          </form>
        </div>
      </aside>
    </div>
  );
};

export default RegisterHours;