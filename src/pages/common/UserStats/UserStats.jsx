import React, { useEffect, useState, useRef } from "react";
// Components
import Sidebar from "../../../components/Layouts/SideBar/SideBar";
import InfoCards from "../../../components/UserStatsUse/InfoCards/InfoCards";
// CSS
import "./UserStats.css";
import "../../../styles/global.css"
import { FaEnvelope, FaKey, FaLock } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
//services
import { resetPassword, sendEmail } from '../../../services/login';
//hooks
import { ResetPassword } from "../../../hooks/useResetPassword"
const UserStats = () => {
  const { email,
    setEmail,
    code,
    setCode,
    password,
    setPassword,
    loading,
    setLoading,
    message,
    setMessage,
    theme,
    setTheme,
    attempts,
    setAttempts, } = ResetPassword()

  const { refEmail, refPassword } = useRef(null);
  
  const handleEmail = async () => {
    if (email) {
      refEmail.current?.showModal()
      sendEmail(email);
    }
  }
  const handlePassword = () => {
    resetPassword(code)
  }
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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
    <div className="stats">
      <Sidebar />

      <main className="menu-stats">
        <div className="menu-stats-cont">
          <header className="profile-header">
            <div className="profile-avatar">
              <img
                src="https://ui-avatars.com/api/?name=Cid&background=0D8ABC&color=fff&size=200"
                alt="Avatar"
              />
            </div>

            <div className="profile-info">
              <h1>Minha Conta</h1>
              <p>Visualize suas informações pessoais.</p>
            </div>
            <div className="Change-theme">
              <button
                className={theme === "dark" ? "sun-button" : "moon-button"}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <FiSun className="sun-icon" />
                ) : (
                  <FiMoon className="moon-icon" />
                )}
              </button>
            </div>
          </header>
          <InfoCards onEmailLoaded={setEmail} />

          <div className="profile-buttons">
            <button type="button" className="btn-primary">
              Editar Perfil
            </button>
            <button onClick={handleEmail()} type="button" className="btn-secondary">
              Alterar Senha
            </button>
          </div>

          <dialog className="change-email">
            <h2>Um Código foi Enviado para o seu Email</h2>
            <p>insira o Código e sua nova senha abaixo:</p>
            <div className="dialog-actions">
              <button className="cancel-btn">
                Cancelar
              </button>
              <button className="confirm-btn">
                Sair
              </button>
            </div>
          </dialog>

          <dialog>
            <form >
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
          </dialog>
        </div>
      </main>
    </div>
  );
};

export default UserStats;
