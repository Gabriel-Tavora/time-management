import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

// services
import { login as apiLogin } from "../../../services/login.js";

// context
import { useAuthValue } from "../../../context/TokenContext.jsx";

// css
import "./Login.css";
import "../../../styles/auth.css";

// icons
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

// components
import AnalogClock from "../../../components/Layouts/AnalogClock/AnalogClock.jsx";
import Input from "../../../components/common/Inputs/Inputs.jsx";
import Button from "../../../components/common/Button/Button.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);

  const { login } = useAuthValue();
  const navigate = useNavigate();

  useEffect(() => {
    if (!message) return;

    const timeout = setTimeout(() => {
      setMessage(null);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [message]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (submitting) return;
    
    setSubmitting(true);
    setMessage(null);

    try {
      const data = await apiLogin(email, password);

      const employeePage = login(
        data.id,
        data.token,
        data.role_id
      );

      if (employeePage) {
        navigate(`/${employeePage}`);
      } else {
        setMessage({
          type: "error",
          text: "Não foi possível determinar seu painel de acesso.",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: error?.message || "Email ou senha inválidos.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="background-clock">
        <AnalogClock />
      </div>

      <section className="login-card">
        <div className="login-header">
          <h1>
            <span>Login</span>
          </h1>

          <p>Insira seus Dados</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaEnvelope className="input-icon" />

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              required
            />

            <span
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              role="button"
              tabIndex={0}
              aria-label={
                showPassword
                  ? "Ocultar senha"
                  : "Mostrar senha"
              }
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {message && (
            <p
              role="alert"
              className={
                message.type === "success"
                  ? "form-success"
                  : "form-error"
              }
            >
              {message.text}
            </p>
          )}

          <div className="login-options">
            <NavLink to="/ForgotPassword">
              Esqueceu a Senha?
            </NavLink>
          </div>

          <Button
            className="btn btn-large"
            type="submit"
            buttonText={
              submitting ? "Entrando..." : "Entrar"
            }
            disabled={submitting}
          />
        </form>
      </section>
    </div>
  );
};

export default Login;