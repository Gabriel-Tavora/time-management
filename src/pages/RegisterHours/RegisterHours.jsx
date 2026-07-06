import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import Sidebar from "../../components/SideBar/SideBar.jsx";
import "./RegisterHours.css";

const RegisterHours = () => {
  const [startTime, setStartTime] = useState("17:00");
  const [endTime, setEndTime] = useState("");
  const [nightTime, setNightTime] = useState(false);
  const [workDate, setWorkDate] = useState("");
  const [observation, setObservation] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

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
    setMensagem(null);

    if (!endTime) {
      setMensagem({ tipo: "erro", texto: "Informe o horário de saída." });
      return;
    }

    if (endTime <= startTime) {
      setMensagem({
        tipo: "erro",
        texto: "O horário de saída deve ser depois do horário inicial.",
      });
      return;
    }

    const data = {
      workDate,
      startTime,
      endTime,
      nightTime,
      observation,
    };

    try {
      setEnviando(true);
      // await api.post("/hours", data);
      console.log(data);

      setMensagem({ tipo: "sucesso", texto: "Hora extra registrada com sucesso!" });
      setEndTime("");
      setObservation("");
      setNightTime(false);
    } catch (err) {
      console.error(err);
      setMensagem({ tipo: "erro", texto: "Erro ao registrar. Tente novamente." });
    } finally {
      setEnviando(false);
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
                🌙 Horário noturno detectado (após 22:00)
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

              {mensagem && (
                <p className={`time-menu-mensagem time-menu-mensagem-${mensagem.tipo}`}>
                  {mensagem.texto}
                </p>
              )}

              <button
                type="submit"
                className="time-menu-send-btn"
                disabled={enviando}
              >
                <FaPlus className="src" />
                {enviando ? "Registrando..." : "Registrar Hora Extra"}
              </button>
            </div>
          </form>
        </div>
      </aside>
    </div>
  );
};

export default RegisterHours;