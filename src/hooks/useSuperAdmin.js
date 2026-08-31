import { useState } from "react";

// context
import { useAuthValue } from "../context/TokenContext";

// services
import { CreateNewUser } from "../services/userData.js";

// utils
import { Messages } from "../utils/message.js";

export function usecreateUser() {
  const { token } = useAuthValue();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const formData = new FormData(e.currentTarget);

      const data = {
        name: formData.get("name")?.trim() || "",
        displayName: formData.get("displayName")?.trim() || "",
        phone: formData.get("phone")?.trim() || "",
        password: formData.get("password") || "",
        email: formData.get("email")?.trim() || "",
        cpf: formData.get("cpf")?.trim() || "",
        role_id: formData.get("role_id")?.trim() || "",
      };

      // =========================
      // NOME
      // =========================

      if (data.name.length < 3) {
        setErrorMessage(Messages.NAME_SHORT);
        return;
      }

      if (!/^[A-Za-zÀ-ÿ\s]+$/.test(data.name)) {
        setErrorMessage(Messages.NAME_LETTER);
        return;
      }

      if (data.displayName.length < 3) {
        setErrorMessage(Messages.DISPLAY_NAME_SHORT);
        return;
      }

      if (/\s/.test(data.displayName)) {
        setErrorMessage(Messages.DISPLAY_NAME_SPACE);
        return;
      }

      const phone = data.phone.replace(/\D/g, "");

      if (phone.length !== 10 && phone.length !== 11) {
        setErrorMessage(Messages.PHONE_INVALID);
        return;
      }

      if (data.password.length < 8) {
        setErrorMessage(Messages.PASSWORD_SHORT);
        return;
      }

      if (!/[A-Za-z]/.test(data.password)) {
        setErrorMessage(Messages.PASSWORD_LETTER);
        return;
      }

      if (!/[0-9]/.test(data.password)) {
        setErrorMessage(Messages.PASSWORD_NUMBER);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(data.email)) {
        setErrorMessage(Messages.EMAIL_INVALID);
        return;
      }

      const cpf = data.cpf.replace(/\D/g, "");

      if (cpf.length !== 11) {
        setErrorMessage(Messages.CPF_INVALID_LENGTH);
        return;
      }

      if (/^(\d)\1{10}$/.test(cpf)) {
        setErrorMessage(Messages.CPF_INVALID);
        return;
      }

      // Primeiro dígito
      let sum = 0;

      for (let i = 0; i < 9; i++) {
        sum += Number(cpf[i]) * (10 - i);
      }

      let remainder = (sum * 10) % 11;

      if (remainder === 10) {
        remainder = 0;
      }

      if (remainder !== Number(cpf[9])) {
        setErrorMessage(Messages.CPF_INVALID);
        return;
      }

      // Segundo dígito
      sum = 0;

      for (let i = 0; i < 10; i++) {
        sum += Number(cpf[i]) * (11 - i);
      }

      remainder = (sum * 10) % 11;

      if (remainder === 10) {
        remainder = 0;
      }

      if (remainder !== Number(cpf[10])) {
        setErrorMessage(Messages.CPF_INVALID);
        return;
      }

      const userData = {
        ...data,
        phone,
        cpf,
      };

      const res = await CreateNewUser(userData, token);
      setResponse(res);
      console.log(userData);
      console.log(res)

    } catch (err) {
      console.error(err);

      const status =
        err.status ??
        err.response?.status ??
        (err.message?.includes("400") ? 400 : undefined) ??
        (err.message?.includes("401") ? 401 : undefined) ??
        (err.message?.includes("403") ? 403 : undefined) ??
        (err.message?.includes("409") ? 409 : undefined) ??
        (err.message?.includes("422") ? 422 : undefined) ??
        (err.message?.includes("429") ? 429 : undefined) ??
        (err.message?.includes("500") ? 500 : undefined);

      switch (status) {
        case 400:
        case 422:
          setErrorMessage(err.message || Messages.VALIDATION);
          break;

        case 401:
          setErrorMessage(Messages.SESSION);
          break;

        case 403:
          setErrorMessage(Messages.FORBIDDEN);
          break;

        case 409:
          setErrorMessage(Messages.DUPLICATED);
          break;

        case 429:
          setErrorMessage(Messages.RATE_LIMITED);
          break;

        case 500:
          setErrorMessage(Messages.SERVER);
          break;

        default:
          setErrorMessage(
            status === undefined
              ? Messages.NETWORK
              : Messages.UNKNOWN
          );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
    response,
    errorMessage,
  };
}
