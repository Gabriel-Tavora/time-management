import React from "react";
//css
import "../../../styles/registerInfo.css";
import { FaPlus, FaSave } from "react-icons/fa";
//components
import Input from "../Inputs/Inputs.jsx";
const RegisterInfo = ({
  mode = "register", // edit or register
  jiraTask,
  observation,
  onJiraTaskChange,
  onObservationChange,
  message,
  isSubmitting,
  isRedirecting,
}) => {

  const isLocked =
    isSubmitting || (mode === "edit" && isRedirecting);

  return (
    <div className="time-menu-send">
      <div className="time-menu-send-obs">
        <label htmlFor="jira">Identificação jira:</label>
        <Input
          id="jira"
          type="text"
          value={jiraTask}
          onChange={onJiraTaskChange}
          name="jira"
          placeholder="Insira a identificação Jira do trabalho"
          disabled={isLocked}
        />
        <label htmlFor="observation">Observação:</label>
        <textarea
          id="observation"
          name="observation"
          rows="4"
          value={observation}
          onChange={onObservationChange}
          placeholder="Descreva o motivo da hora extra (opcional)"
          disabled={isLocked}
        />
      </div>

      {message && (
        <p
          className={`time-menu-message time-menu-message-${message.type}`}
          role={message.type === "error" ? "alert" : "status"}
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        className="time-menu-send-btn"
        disabled={isLocked}
      >
        {mode === "register" ? (
          <>
            <FaPlus className="src" />
            {isSubmitting ? "Registrando..." : "Registrar Hora Extra"}
          </>) :
          (
            <>
              <FaSave className="src" />
              {isSubmitting
                ? "Alterando..."
                : isRedirecting
                  ? "Salvo! Voltando..."
                  : "Alterar Hora Extra"}
            </>
          )}
      </button>
    </div>
  );
};

export default RegisterInfo;
