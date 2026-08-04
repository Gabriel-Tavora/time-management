import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FaEnvelope, FaKey, FaLock } from "react-icons/fa";
import { usePasswordReset } from "../../../hooks/usePasswordReset";
import "./ForgotPassword.css";

const STEPS = {
  EMAIL: "email",
  PASSWORD: "password",
};

const FormMessage = ({ message }) => {
  if (!message) return null;
  return (
    <p
      role="status"
      aria-live="polite"
      className={message.type === "success" ? "form-success" : "form-error"}
    >
      {message.text}
    </p>
  );
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.EMAIL);

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
    resetAll,
    sendCode,
    submitPassword,
    cleanup,
  } = usePasswordReset({
    maxAttempts: 4,
    onSuccess: () => navigate("/"),
  });

  React.useEffect(() => cleanup, [cleanup]);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    const result = await sendCode(email);
    if (result.success) {
      setStep(STEPS.PASSWORD);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    const result = await submitPassword(code, password);
    if (result.reason === "max_attempts") {
      setStep(STEPS.EMAIL);
    }
  };

  return (
    <div className="Forgotlogin">
      <section className="Forgotlogin-section">
        <h1>Esqueci a senha</h1>

        {step === STEPS.EMAIL && (
          <form onSubmit={handleSendEmail}>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Digite seu Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <FormMessage message={message} />
            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </form>
        )}

        {step === STEPS.PASSWORD && (
          <form onSubmit={handleSubmitPassword}>
            <div className="input-group">
              <FaKey className="input-icon" />
              <input
                type="text"
                placeholder="Digite o código enviado por email"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Confirme a senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <FormMessage message={message} />
            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Confirmar"}
            </button>
          </form>
        )}

        <NavLink to="/" className="forgot-pass">
          <span>Voltar para Login</span>
        </NavLink>
      </section>
    </div>
  );
};

export default ForgotPassword;