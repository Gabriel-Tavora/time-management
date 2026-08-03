import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FaEnvelope, FaKey, FaLock } from "react-icons/fa";
//css
import "./ForgotPassword.css";
//services
import { sendEmail, resetPassword } from '../../../services/login';

const STEPS = {
  EMAIL: "email",
  PASSWORD: "password",
};

const MAX_ATTEMPTS = 4;

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
  const [step, setStep] = useState(STEPS.EMAIL);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [attempts, setAttempts] = useState(0);

  // Dados do formulário
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const showSuccess = (text) => setMessage({ type: "success", text });
  const showError = (text) => setMessage({ type: "error", text });

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      await sendEmail(email.trim());
      showSuccess(
        "Se o email existir, você receberá um código para redefinir sua senha."
      );
      setStep(STEPS.PASSWORD);
    } catch (err) {
      showError(
        err.message ||
        "Não foi possível enviar o email de recuperação."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (password !== confirmPassword) {
      showError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(code.trim(), password);
      setAttempts(0);
      showSuccess("Senha redefinida com sucesso.");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        showError(
          "Você excedeu o número máximo de tentativas. Reinicie o processo."
        );
        setAttempts(0);
        setPassword("");
        setConfirmPassword("");
        setCode("");
        setStep(STEPS.EMAIL);
        return;
      }

      showError(
        `${err.message || "Código inválido ou expirado."} Restam ${MAX_ATTEMPTS - newAttempts
        } tentativa(s).`
      );
    } finally {
      setLoading(false);
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