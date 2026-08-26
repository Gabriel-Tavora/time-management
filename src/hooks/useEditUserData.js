import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
// Context
import { useAuthValue } from "../context/TokenContext.jsx";
// Services
import { getCurrentUser, editUserData } from "../services/userData.js";
//utils
import { validateField } from '../utils/validateField';

const MESSAGE_DURATION_MS = 3000;

export function useEditUserData() {

  const { token } = useAuthValue();

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


  return {
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
  };
}