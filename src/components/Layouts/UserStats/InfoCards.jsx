import React, { useCallback, useEffect, useRef } from "react";

const FIELDS_CONFIG = [
  {
    key: "name",
    label: "Nome",
    type: "text",
    placeholder: "Seu nome completo",
    maxLength: 100,
  },
  {
    key: "display_name",
    label: "Apelido",
    type: "text",
    placeholder: "Como quer ser chamado",
    maxLength: 50,
  },
  {
    key: "email",
    label: "E-mail",
    type: "email",
    placeholder: "seu@email.com",
    maxLength: 120,
  },
  {
    key: "phone",
    label: "Telefone",
    type: "tel",
    placeholder: "(00) 00000-0000",
    maxLength: 20,
  },
];

const SAVE_DEBOUNCE_MS = 1000;

const InfoCards = ({
  userLoading,
  user,
  editingField,
  saving,
  inputRefs,
  draftValues,
  startEditing,
  cancelEditing,
  handleDraftChange,
  handleSaveField,
  handleKeyDown,
}) => {
  const timeoutsRef = useRef({});
  const latestValuesRef = useRef({});
  const prevEditingFieldRef = useRef(editingField);

  const clearFieldTimeout = useCallback((key) => {
    if (timeoutsRef.current[key]) {
      clearTimeout(timeoutsRef.current[key]);
      delete timeoutsRef.current[key];
    }
  }, []);

  const flushSave = useCallback(
    (key) => {
      clearFieldTimeout(key);
      const value = latestValuesRef.current[key];
      handleSaveField(key, value);
    },
    [clearFieldTimeout, handleSaveField]
  );
  useEffect(() => {
    const prevField = prevEditingFieldRef.current;

    if (prevField && prevField !== editingField && timeoutsRef.current[prevField]) {
      flushSave(prevField);
    }

    prevEditingFieldRef.current = editingField;
  }, [editingField, flushSave]);

  useEffect(() => {
    return () => {
      Object.keys(timeoutsRef.current).forEach((key) => {
        clearTimeout(timeoutsRef.current[key]);
      });
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!editingField) return;

      const input = inputRefs.current[editingField];
      if (!input || input.contains(event.target)) return;

      const editField = input.closest(".edit-field");
      if (editField?.contains(event.target)) return;

      if (timeoutsRef.current[editingField]) {
        flushSave(editingField);
      } else {
        cancelEditing();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingField, inputRefs, cancelEditing, flushSave]);

  const handleChange = useCallback(
    (key, value) => {
      latestValuesRef.current[key] = value;
      handleDraftChange(key, value);

      clearFieldTimeout(key);

      timeoutsRef.current[key] = setTimeout(() => {
        flushSave(key);
      }, SAVE_DEBOUNCE_MS);
    },
    [handleDraftChange, clearFieldTimeout, flushSave]
  );

  const handleCancel = useCallback(
    (key) => {
      clearFieldTimeout(key);
      delete latestValuesRef.current[key];
      cancelEditing();
    },
    [clearFieldTimeout, cancelEditing]
  );

  const wrappedHandleKeyDown = useCallback(
    (event, key) => {
      if (event.key === "Enter") {
        clearFieldTimeout(key);
        latestValuesRef.current[key] = draftValues[key];
      } else if (event.key === "Escape") {
        clearFieldTimeout(key);
      }
      handleKeyDown(event, key);
    },
    [clearFieldTimeout, draftValues, handleKeyDown]
  );

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
    <section className="menu-data">
      {userLoading && !user
        ? skeletonCards()
        : FIELDS_CONFIG.map(({ key, label, type, placeholder, maxLength }) => {
          const isEditing = editingField === key;
          const value = user?.[key];
          const hasValue = Boolean(value);

          const showField = key !== "display_name" || hasValue || isEditing;
          if (!showField) return null;

          return (
            <div
              key={key}
              className={`info-card ${isEditing ? "info-card--editing" : ""}`}
              onClick={() => {
                if (!isEditing && !saving) {
                  startEditing(key);
                }
              }}
              role={isEditing ? undefined : "button"}
              tabIndex={isEditing ? undefined : 0}
              onKeyDown={
                isEditing
                  ? undefined
                  : (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (!saving) startEditing(key);
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
                <div className="edit-field" onClick={(e) => e.stopPropagation()}>
                  <label htmlFor={`edit-${key}`}>{label}</label>

                  <input
                    ref={(el) => {
                      inputRefs.current[key] = el;
                    }}
                    id={`edit-${key}`}
                    type={type}
                    value={draftValues[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    onKeyDown={(e) => wrappedHandleKeyDown(e, key)}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    disabled={saving}
                    autoComplete="off"
                  />

                  {saving && <span className="saving-text">Salvando...</span>}
                </div>
              )}
            </div>
          );
        })}
    </section>
  );
};

export default InfoCards;