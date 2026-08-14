import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
//services
import { login as apiLogin } from "../../../services/login.js";
//context
import { useAuthValue } from "../../../context/TokenContext.jsx";
//css
import "./Login.css";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
//components
import AnalogClock from "../../../components/Layouts/AnalogClock/AnalogClock.jsx";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthValue();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await apiLogin(email, password);

      const employeePage = login(data.id, data.token, data.role_id);

      if (employeePage) {
        navigate(`/${employeePage}`);
      } else {
        console.warn("Nenhuma página mapeada para este usuário.");
        alert(
          "Não foi possível determinar seu painel de acesso. Contate o suporte.",
        );
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
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
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="login-options">
            <NavLink to="/ForgotPassword">Esqueceu a Senha?</NavLink>
          </div>

          <button type="submit">Entrar</button>
        </form>
      </section>
    </div>
  );
};

export default Login;
