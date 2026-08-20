import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";

// Icons
import {
  FaEnvelope,
  FaKey,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

// Hook
import { usePasswordReset } from "../../../hooks/usePasswordReset";

// CSS
import "./ForgotPassword.css";
import "../../../styles/auth.css"
//components 
import Input from "../../../components/Layouts/Inputs/Inputs.jsx"
import Button from "../../../components/Layouts/Button/Button.jsx"
const STEPS = {
  EMAIL: "email",
  PASSWORD: "password",
};


const FormMessage = ({ message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [message]);

  if (!visible) return null;

  return (
    <p
      role="status"
      aria-live="polite"
      className={
        message.type === "success"
          ? "form-success"
          : "form-error"
      }
    >
      {message.text}
    </p>
  );
};


const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(STEPS.EMAIL);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const {
    email,
    setEmail,
    code,
    setCode,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    message,
    sendCode,
    submitPassword,
    cleanup,
  } = usePasswordReset({
    maxAttempts: 4,

    onSuccess: () => {
      navigate("/");
    },
  });

  React.useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (loading) return;

    const result = await sendCode(email);

    if (result?.success) {
      setStep(STEPS.PASSWORD);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (loading) return;
    const result = await submitPassword(
      code,
      password
    );

    if (result?.reason === "max_attempts") {
      setStep(STEPS.EMAIL);
    }
  };

  return (
    <div className="login-page">
      <section className="login-card">
        <div className="forgot-header">
          <h1>
            {step === STEPS.EMAIL
              ? "Esqueci a senha"
              : "Redefinir senha"}
          </h1>

          <p>
            {step === STEPS.EMAIL
              ? "Insira seu email para receber o código."
              : "Insira o código e defina sua nova senha."}
          </p>
        </div>

        {step === STEPS.EMAIL && (
          <form onSubmit={handleSendEmail}>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <Input
                type="email"
                placeholder="Digite seu Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                disabled={loading}
                required
                autoComplete="email"
              />
            </div>
            <FormMessage message={message} />
            <Button
              className="btn btn-large"
              type="submit"
              disabled={loading}
              buttonText={loading
                ? "Enviando..."
                : "Enviar código"}
            />

          </form>
        )}

        {step === STEPS.PASSWORD && (
          <form onSubmit={handleSubmitPassword}>
            <div className="input-group">
              <FaKey className="input-icon" />
              <Input
                type="text"
                placeholder="Código enviado por email"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value)
                }
                disabled={loading}
                required
                autoComplete="one-time-code"
              />
            </div>


            <div className="input-group">
              <FaLock className="input-icon" />
              <Input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Nova senha"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                disabled={loading}
                required
                minLength={8}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <Input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirme a senha"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                disabled={loading}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    (prev) => !prev
                  )
                }
                disabled={loading}
                aria-label={
                  showConfirmPassword
                    ? "Ocultar confirmação"
                    : "Mostrar confirmação"
                }
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>

            <FormMessage message={message} />
            <Button
             className="btn btn-large"
              type="submit"
              disabled={loading}
              buttonText= {loading
                ? "Alterando..."
                : "Confirmar senha"}
            />
          </form>
        )}

        <NavLink
          to="/"
          className="forgot-pass"
        >
          Voltar para Login
        </NavLink>

      </section>
    </div>
  );
};

export default ForgotPassword;