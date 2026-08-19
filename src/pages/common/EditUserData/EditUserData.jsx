import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// components
import Sidebar from "../../../components/Layouts/SideBar/SideBar";
import Button from "../../../components/Layouts/Button/Button";
// services
import { getCurrentUser, editUserData } from "../../../services/userData.js";
// context
import { useAuthValue } from "../../../context/TokenContext";
// css
import "../UserStats/UserStats.css";
import "../../../styles/global.css";
import "../../../components/UserStatsUse/InfoCards/InfoCards.css";

const EditUserData = () => {
  const { token } = useAuthValue();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();
  const handleBack = (path) => {
    navigate(path);
  }
  // Campos editáveis
  const [editingField, setEditingField] = useState(null);
  const [draftValues, setDraftValues] = useState({
    name: "",
    email: "",
    phone: "",
    display_name: "",
  });

  async function loadUserData() {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await getCurrentUser(token);
      setUser(response);
      setDraftValues({
        name: response?.name || "",
        email: response?.email || "",
        phone: response?.phone || "",
        display_name: response?.display_name || "",
      });
    } catch (e) {
      console.error(e);
      setMessage({ type: "error", text: "Erro ao carregar dados do usuário." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      loadUserData();
    }
  }, [token]);

  const startEditing = (field) => {
    if (!user) return;
    setEditingField(field);
    setDraftValues((prev) => ({
      ...prev,
      [field]: user[field] || "",
    }));
    setMessage({ type: "", text: "" });
  };

  const cancelEditing = () => {
    setEditingField(null);
    setMessage({ type: "", text: "" });
  };

  const handleDraftChange = (field, value) => {
    setDraftValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveField = async (field) => {
    if (!user || !token) return;

    const originalValue = user[field] || "";
    const newValue = draftValues[field]?.trim();

    if (newValue === originalValue) {
      setEditingField(null);
      return;
    }

    // Validação básica
    if (field === "email" && newValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue)) {
      setMessage({ type: "error", text: "E-mail inválido." });
      return;
    }
    if (field === "phone" && newValue && !/^[\d\s\-\+\(\)]{8,}$/.test(newValue)) {
      setMessage({ type: "error", text: "Telefone inválido." });
      return;
    }
    if ((field === "name" || field === "display_name") && newValue.length < 2) {
      setMessage({ type: "error", text: "Nome muito curto." });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = { [field]: newValue };
      await editUserData(payload, token);

      setUser((prev) => ({ ...prev, [field]: newValue }));
      setEditingField(null);
      setMessage({ type: "success", text: "Dado atualizado com sucesso!" });

      // Limpa mensagem após 3s
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (e) {
      console.error(e);
      setMessage({ type: "error", text: "Erro ao salvar. Tente novamente." });
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e, field) => {
    if (e.key === "Enter") {
      handleSaveField(field);
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  const fieldsConfig = [
    { key: "name", label: "Nome", type: "text", placeholder: "Seu nome completo" },
    { key: "display_name", label: "Apelido", type: "text", placeholder: "Como quer ser chamado" },
    { key: "email", label: "E-mail", type: "email", placeholder: "seu@email.com" },
    { key: "phone", label: "Telefone", type: "tel", placeholder: "(00) 00000-0000" },
  ];

  return (
    <div className="stats">
      <Sidebar />
      <main className="menu-stats">
        <div className="menu-stats-cont">
          <header className="profile-header">
            <div className="profile-info">
              <h1>Editar Dados</h1>
            </div>
          </header>

          {message.text && (
            <div className={`edit-toast edit-toast--${message.type}`}>
              {message.text}
            </div>
          )}

          <section className="menu-data">
            {loading && !user ? (
              <div className="info-card info-card--loading">
                <span>Carregando...</span>
              </div>
            ) : (
              fieldsConfig.map(({ key, label, type, placeholder }) => {
                const isEditing = editingField === key;
                const value = user?.[key];
                const showField = key !== "display_name" || value;

                if (!showField && !isEditing) return null;

                return (
                  <div
                    key={key}
                    className={`info-card ${isEditing ? "info-card--editing" : ""}`}
                    onClick={() => !isEditing && !saving && startEditing(key)}
                  >
                    {!isEditing ? (
                      <>
                        <span>{label}</span>
                        <h2>{value || <em className="empty-value">Não informado</em>}</h2>
                        <small className="edit-hint">Clique para editar</small>
                      </>
                    ) : (
                      <div className="edit-field" onClick={(e) => e.stopPropagation()}>
                        <label htmlFor={`edit-${key}`}>{label}</label>
                        <input
                          id={`edit-${key}`}
                          type={type}
                          value={draftValues[key]}
                          onChange={(e) => handleDraftChange(key, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, key)}
                          placeholder={placeholder}
                          autoFocus
                          disabled={saving}
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
            <></>
            <Button
              buttonText="Voltar"
              className="btn-medium btn"
              onClick={() => handleBack("/UserStats")}
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default EditUserData;