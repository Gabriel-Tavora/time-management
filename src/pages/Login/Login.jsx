import React from "react";
// CSS
import "../components/Login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
const login = () => {
  return (
    <div className="login-page">
      <section className="login-section">
        <h1>login</h1>
        <form>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Senha"
              required
            />
          </div>
            <a href="">Esqueceu a senha?</a>
          <button type="submit">Entrar</button>
        </form>
      </section>
    </div>
  );
};

export default login;
