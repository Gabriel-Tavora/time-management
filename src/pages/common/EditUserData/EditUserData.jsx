import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Sidebar from "../../../components/Layouts/SideBar/SideBar";
import Button from "../../../components/common/Button/Button";

// CSS
import "../UserStats/UserStats.css";
import "../../../styles/global.css";

//utils
import { validateField } from '../../../utils/validateField';
//hooks 
import { useEditUserData } from '../../../hooks/useEditUserData.js';

const FIELDS_CONFIG = [
  { key: "name", label: "Nome", type: "text", placeholder: "Seu nome completo", maxLength: 100 },
  { key: "display_name", label: "Apelido", type: "text", placeholder: "Como quer ser chamado", maxLength: 50 },
  { key: "email", label: "E-mail", type: "email", placeholder: "seu@email.com", maxLength: 120 },
  { key: "phone", label: "Telefone", type: "tel", placeholder: "(00) 00000-0000", maxLength: 20 },
];

const EditUserData = () => {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate("/UserStats");
  }, [navigate]);

  const {
    loading,
    saving,
    user,
    message,
    editingField,
    draftValues,
    inputRefs,
    startEditing,
    cancelEditing,
    handleDraftChange,
    handleSaveField,
    handleKeyDown,
  } = useEditUserData();

const skeletonCards = () => (
  <>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={`sk-${i}`} className="info-card info-card--skeleton">
        <span className="skeleton-line skeleton-line--short" />
        <h2 className="skeleton-line skeleton-line--long" />
      </div>
    ))}
  </>
);
  return (
    <div className="stats">
      <Sidebar />
      <main className="menu-stats">
        <div className="menu-stats-cont">
          <header className="profile-header">
            <div className="profile-info">
              <h1>Editar Dados</h1>
              <p>Clique em um campo para editar</p>
            </div>
          </header>

          {message.text && (
            <div
              className={`edit-toast edit-toast--${message.type}`}
              role="alert"
              aria-live="polite"
            >
              {message.text}
            </div>
          )}

          <section className="menu-data">
            {loading && !user ? (
              skeletonCards
            ) : (
              FIELDS_CONFIG.map(({ key, label, type, placeholder, maxLength }) => {
                const isEditing = editingField === key;
                const value = user?.[key];
                const hasValue = Boolean(value);
                const showField = key !== "display_name" || hasValue || isEditing;

                if (!showField) return null;

                return (
                  <div
                    key={key}
                    className={`info-card ${isEditing ? "info-card--editing" : ""}`}
                    onClick={() => !isEditing && !saving && startEditing(key)}
                    role={isEditing ? undefined : "button"}
                    tabIndex={isEditing ? undefined : 0}
                    onKeyDown={
                      isEditing
                        ? undefined
                        : (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            startEditing(key);
                          }
                        }
                    }
                  >
                    {!isEditing ? (
                      <>
                        <span className="info-card__label change">{label}</span>
                        <h2 className="info-card__value change">
                          {value || <em className="empty-value">Não informado</em>}
                        </h2>
                      </>
                    ) : (
                      <div
                        className="edit-field"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <label htmlFor={`edit-${key}`}>{label}</label>
                        <input
                          ref={(el) => (inputRefs.current[key] = el)}
                          id={`edit-${key}`}
                          type={type}
                          value={draftValues[key]}
                          onChange={(e) => handleDraftChange(key, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, key)}
                          placeholder={placeholder}
                          maxLength={maxLength}
                          disabled={saving}
                          autoComplete="off"
                        />
                        <div className="edit-actions">
                          <Button
                            className="approved-btn"
                            onClick={() => handleSaveField(key)}
                            disabled={saving}
                            buttonText={saving ? "Salvando..." : "Salvar"}
                          />
                          <Button
                            className="rejected-btn"
                            onClick={cancelEditing}
                            disabled={saving}
                            buttonText="Cancelar"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </section>

          <div className="profile-buttons">
            <Button
              buttonText="Voltar"
              className="btn-medium btn"
              onClick={handleBack}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditUserData;