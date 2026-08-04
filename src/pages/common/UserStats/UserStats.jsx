import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Layouts/SideBar/SideBar";
import InfoCards from "../../../components/UserStatsUse/InfoCards/InfoCards";
import { usePasswordReset } from "../../../hooks/usePasswordReset";
import { useTheme } from "../../../hooks/useTheme";
import "./UserStats.css";
import "../../../styles/global.css";
import { FaKey, FaLock } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";

const UserStats = () => {
  const navigate = useNavigate();
  const confirmDialogRef = useRef(null);
  const formDialogRef = useRef(null);
  const { theme, toggle, isDark } = useTheme();

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
    resetForm,
    sendCode,
    submitPassword,
    cleanup,
  } = usePasswordReset({
    maxAttempts: 3,
    onSuccess: () => navigate("/"),
  });

  React.useEffect(() => cleanup, [cleanup]);

  const handleOpenConfirm = () => {
    confirmDialogRef.current?.showModal();
  };

  const handleCancelConfirm = () => {
    confirmDialogRef.current?.close();
  };

  const handleConfirmSendCode = async () => {
    const result = await sendCode();
    if (result.success) {
      confirmDialogRef.current?.close();
      formDialogRef.current?.showModal();
    }
  };

  const handleCancelForm = () => {
    formDialogRef.current?.close();
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitPassword(code, password);
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
                type="button"
                className={isDark ? "sun-button" : "moon-button"}
                onClick={toggle}
                aria-label="Alternar tema"
              >
                {isDark ? (
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
            <button
              type="button"
              className="btn-secondary"
              onClick={handleOpenConfirm}
              disabled={!email}
            >
              Alterar Senha
            </button>
          </div>

          {/* Dialog 1: confirmação */}
          <dialog ref={confirmDialogRef} className="dialog-confirm">
            <h2>Alterar senha</h2>
            <p>
              Um código será enviado para <strong>{email}</strong>. Deseja
              continuar?
            </p>
            {message && (
              <p className={`form-message ${message.type}`}>{message.text}</p>
            )}
            <div className="dialog-actions">
              <button
                className="cancel-btn"
                onClick={handleCancelConfirm}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                className="confirm-btn"
                onClick={handleConfirmSendCode}
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar código"}
              </button>
            </div>
          </dialog>

          {/* Dialog 2: código + nova senha */}
          <dialog ref={formDialogRef} className="dialog-form">
            <h2>Confirme o código e defina a nova senha</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <FaKey className="input-icon" />
                <input
                  type="text"
                  placeholder="Digite o código"
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
                  minLength={8}
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
                  minLength={8}
                />
              </div>
              {message && (
                <p className={`form-message ${message.type}`}>{message.text}</p>
              )}
              <div className="dialog-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancelForm}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="confirm-btn"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Confirmar"}
                </button>
              </div>
            </form>
          </dialog>
        </div>
      </main>
    </div>
  );
};

export default UserStats;
