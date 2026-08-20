import { useState, useCallback, useRef } from "react";
import { sendEmail, resetPassword } from "../services/login";

const DEFAULT_MAX_ATTEMPTS = 3;

export function usePasswordReset(options = {}) {

  const {
    maxAttempts = DEFAULT_MAX_ATTEMPTS,
    onSuccess,           
    initialEmail = "",   
  } = options;

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const successTimerRef = useRef(null);

  const showSuccess = useCallback((text) => {
    setMessage({ type: "success", text });
  }, []);

  const showError = useCallback((text) => {
    setMessage({ type: "error", text });
  }, []);

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  const resetForm = useCallback(() => {
    setCode("");
    setPassword("");
    setConfirmPassword("");
    setAttempts(0);
    clearMessage();
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
  }, [clearMessage]);

  const resetAll = useCallback(() => {
    setEmail("");
    resetForm();
  }, [resetForm]);

  const sendCode = useCallback(async (emailToSend = email) => {
    if (!emailToSend?.trim()) {
      showError("Não foi possível identificar seu email.");
      return { success: false, reason: "no_email" };
    }

    setLoading(true);
    clearMessage();

    try {
      await sendEmail(emailToSend.trim());
      return { success: true };
    } catch (err) {
      showError(err.message || "Não foi possível enviar o código. Tente novamente.");
      return { success: false, reason: "send_failed", error: err };
    } finally {
      setLoading(false);
    }
  }, [email, showError, clearMessage]);


  const submitPassword = useCallback(async (codeInput, passwordInput) => {
    if (password !== confirmPassword) {
      showError("As senhas não coincidem.");
      return { success: false, reason: "mismatch" };
    }

    setLoading(true);
    clearMessage();

    try {
      await resetPassword(codeInput.trim(), passwordInput);
      showSuccess("Senha redefinida com sucesso.");
      setAttempts(0);

      if (onSuccess) {
        successTimerRef.current = setTimeout(() => {
          onSuccess();
        }, 2000);
      }

      return { success: true };
    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= maxAttempts) {
        showError("Você excedeu o número máximo de tentativas. Reinicie o processo.");
        resetForm();
        return { success: false, reason: "max_attempts" };
      }

      showError(
        `${err.message || "Código inválido ou expirado."} Restam ${
          maxAttempts - newAttempts
        } tentativa(s).`
      );
      return { success: false, reason: "invalid", remaining: maxAttempts - newAttempts };
    } finally {
      setLoading(false);
    }
  }, [password, confirmPassword, attempts, maxAttempts, showError, showSuccess, clearMessage, resetForm, onSuccess]);


  const cleanup = useCallback(() => {
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
    }
  }, []);

  return {
    email,
    code,
    password,
    confirmPassword,
    loading,
    message,
    attempts,
    setEmail,
    setCode,
    setPassword,
    setConfirmPassword,
    showSuccess,
    showError,
    clearMessage,
    resetForm,
    resetAll,
    sendCode,
    submitPassword,
    cleanup,
  };
}