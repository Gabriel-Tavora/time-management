// react
import React from "react";
import { useState } from "react";
import { login } from "../../services/api.js";
// DOM
import { useNavigate } from "react-router-dom";

// CSS
import "../Login/Login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // funções

  const handleLogin = async (e) => {
    e.preventDefault();

    const user = await login(email, password);
    if (user.length) {
      localStorage.setItem("user", JSON.stringify(user[0]));

      window.location.href = "/user";
    }
  };

  const avance = (e) => {
    e.preventDefault();
    navigate("/userscreen");
  };

  return (
    <div className="login-page">
      <section className="login-section">
        <h1>Login</h1>

        <form onSubmit={avance}>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input type="email" placeholder="Email" required />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input type="password" placeholder="Senha" required />
          </div>

          <a href="">Esqueceu a senha?</a>

          <button type="submit">Entrar</button>
        </form>
      </section>
    </div>
  );
};

export default Login;
