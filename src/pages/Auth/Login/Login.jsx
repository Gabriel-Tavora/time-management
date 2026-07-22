import React, { useState } from "react";
import { useNavigate,NavLink } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
//services
import { login as apiLogin } from "../../../services/login.js";
//context
import { useAuthValue } from "../../../context/TokenContext.jsx";
//css
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading} = useAuthValue();
  //navigate
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await apiLogin(email, password);

      login(data.id, data.token);

      navigate("/Coordinator");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="login-page">
      <section className="login-section">
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <NavLink to="/FotgotPassword" className="forgot-pass">
            <span>Esqueceu a senha?</span>
          </NavLink>

          <button type="submit">
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;
