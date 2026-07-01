import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { login } from "../../services/api";

import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    navigate("/userscreen");
    try {
      const user = await login(email, password);

      localStorage.setItem("user", JSON.stringify(user));

      navigate("/userscreen");
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

          <a href="#" className="forgot-pass">
            Esqueceu a senha?
          </a>

          <button type="submit">Entrar</button>
        </form>
      </section>
    </div>
  );
};

export default Login;