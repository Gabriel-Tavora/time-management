import React from "react";
//css
import "./RegisterInfo.css";
import { FaPlus } from "react-icons/fa";

const RegisterInfo = ({
  observation,
  setObservation,
  message,
  isSubmitting,
  jiraTask, 
  setjiraTesk
}) => {
  return (
    <div className="time-menu-send">
      <div className="time-menu-send-obs">
        <label htmlFor="jira">Identificação jira:</label>
        <input
          id="jira"
          type="text"
          value={jiraTask}
          onChange={(e) => setjiraTesk(e.target.value)}
          name="jira"
          placeholder="Insira a identificação jira do trabalho"
        />
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
        <p className={`time-menu-message time-menu-message-${message.type}`}>
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
  );
};

export default RegisterInfo;
