import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Sidebar from "../../../components/Layouts/SideBar/SideBar";
import Button from "../../../components/Layouts/Button/Button";

// Services
import { getCurrentUser, editUserData } from "../../../services/userData.js";

// Context
import { useAuthValue } from "../../../context/TokenContext";

// CSS
import "../UserStats/UserStats.css";
import "../../../styles/global.css";

const MESSAGE_DURATION_MS = 3000;

const FIELDS_CONFIG = [
  { key: "name", label: "Nome", type: "text", placeholder: "Seu nome completo", maxLength: 100 },
  { key: "display_name", label: "Apelido", type: "text", placeholder: "Como quer ser chamado", maxLength: 50 },
  { key: "email", label: "E-mail", type: "email", placeholder: "seu@email.com", maxLength: 120 },
  { key: "phone", label: "Telefone", type: "tel", placeholder: "(00) 00000-0000", maxLength: 20 },
];

const validateField = (field, value) => {
  const trimmed = value?.trim() || "";
  if (field === "email" && trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "E-mail inválido.";
  }
  if (field === "phone" && trimmed && !/^[\d\s\-\+\(\)]{8,}$/.test(trimmed)) {
    return "Telefone inválido.";
  }
  if ((field === "name" || field === "display_name") && trimmed.length > 0 && trimmed.length < 2) {
    return "Nome muito curto.";
  }
  return null;
};

const EditUserData = () => {
  const { token } = useAuthValue();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [editingField, setEditingField] = useState(null);
  const [draftValues, setDraftValues] = useState({
    name: "",
    email: "",
    phone: "",
    display_name: "",
  });

  const abortControllerRef = useRef(null);
  const messageTimeoutRef = useRef(null);
  const inputRefs = useRef({});
  const isMountedRef = useRef(true);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const showMessage = useCallback((type, text) => {
    if (!isMountedRef.current) return;
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);

    setMessage({ type, text });
    messageTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) setMessage({ type: "", text: "" });
    }, MESSAGE_DURATION_MS);
  }, []);

  const loadUserData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    showMessage("", "");
    abortControllerRef.current = new AbortController();

    try {
      const response = await getCurrentUser(token, { signal: abortControllerRef.current.signal });
      if (!isMountedRef.current) return;

      setUser(response);
      setDraftValues({
        name: response?.name || "",
        email: response?.email || "",
        phone: response?.phone || "",
        display_name: response?.display_name || "",
      });
    } catch (e) {
      if (e.name === "AbortError") return;
      console.error(e);
      showMessage("error", "Erro ao carregar dados do usuário.");
    } finally {
      if (isMountedRef.current) setLoading(false);
      abortControllerRef.current = null;
    }
  }, [token, showMessage]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const startEditing = useCallback((field) => {
    if (!user) return;
    setEditingField(field);
    setDraftValues((prev) => ({ ...prev, [field]: user[field] || "" }));
    showMessage("", "");

    // Foca o input no próximo tick (depois do re-render)
    requestAnimationFrame(() => {
      inputRefs.current[field]?.focus();
    });
  }, [user, showMessage]);

  const cancelEditing = useCallback(() => {
    setEditingField(null);
    showMessage("", "");
  }, [showMessage]);

  const handleDraftChange = useCallback((field, value) => {
    setDraftValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveField = useCallback(async (field) => {
    if (!user || !token) return;

    const originalValue = (user[field] || "").trim();
    const newValue = (draftValues[field] || "").trim();

    if (newValue === originalValue) {
      setEditingField(null);
      return;
    }

    const error = validateField(field, newValue);
    if (error) {
      showMessage("error", error);
      return;
    }

    setSaving(true);
    showMessage("", "");
    abortControllerRef.current = new AbortController();

    try {
      const payload = { [field]: newValue };
      await editUserData(payload, token, { signal: abortControllerRef.current.signal });

      if (!isMountedRef.current) return;

      setUser((prev) => ({ ...prev, [field]: newValue }));
      setEditingField(null);
      showMessage("success", "Dado atualizado com sucesso!");
    } catch (e) {
      if (e.name === "AbortError") return;
      console.error(e);
      showMessage("error", e.message || "Erro ao salvar. Tente novamente.");
    } finally {
      if (isMountedRef.current) setSaving(false);
      abortControllerRef.current = null;
    }
  }, [user, token, draftValues, showMessage]);

  const handleKeyDown = useCallback((e, field) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveField(field);
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  }, [handleSaveField, cancelEditing]);

  const handleBack = useCallback(() => {
    navigate("/UserStats");
  }, [navigate]);

  // Skeleton cards para loading
  const skeletonCards = useMemo(() =>
    Array.from({ length: 4 }).map((_, i) => (
      <div key={`sk-${i}`} className="info-card info-card--skeleton">
        <span className="skeleton-line skeleton-line--short" />
        <h2 className="skeleton-line skeleton-line--long" />
      </div>
    )), []);

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
                        <span className="info-card__label">{label}</span>
                        <h2 className="info-card__value">
                          {value || <em className="empty-value">Não informado</em>}
                        </h2>
                        <small className="edit-hint">
                          {saving ? "Salvando..." : "Clique para editar"}
                        </small>
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