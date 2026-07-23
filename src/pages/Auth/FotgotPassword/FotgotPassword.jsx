import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
//css
import "./FotgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setMessage({
        type: "success",
        text: "Se o email existir em nossa base, você receberá um link para redefinir sua senha.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: "Não foi possível enviar o email de recuperação. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Forgotlogin">
      <section className="Forgotlogin-section">
        <h1>Esqueci a senha</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Envie seu Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {message && (
            <p
              className={
                message.type === "success" ? "form-success" : "form-error"
              }
            >
              {message.text}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>
        <NavLink to="/" className="forgot-pass">
          <span>Voltar para Login</span>
        </NavLink>
      </section>
    </div>
  );
};

export default ForgotPassword;
