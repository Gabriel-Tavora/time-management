import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//components
import Sidebar from "../../../components/Layouts/SideBar/SideBar";
import InfoCards from "../../../components/UserStatsUse/InfoCards/InfoCards";
import Button from "../../../components/Layouts/Button/Button";
//hooks
import { usePasswordReset } from "../../../hooks/usePasswordReset";

//context
import { useTheme } from "../../../context/themeContext.jsx";

//utils
import { getAvatarUrl, getAvatarByUser } from "../../../utils/avatarUtils";

//css
import "./UserStats.css";
import "../../../styles/global.css";
import { FaKey, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";

const UserStats = () => {
  const navigate = useNavigate();
  const confirmDialogRef = useRef(null);
  const formDialogRef = useRef(null);
  const { theme, toggle, isDark } = useTheme();
  const [avatarUrl, setAvatarUrl] = useState(() =>
    getAvatarUrl({ seed: "guest" }),
  );
  const [showPassword, setShowPassword] = useState(false);

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

  useEffect(() => cleanup, [cleanup]);

  const handleEmailLoaded = (loadedEmail) => {
    setEmail(loadedEmail);
    if (loadedEmail) {
      setAvatarUrl(getAvatarByUser({ email: loadedEmail }));
    }
  };
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
                src={avatarUrl}
                alt="Avatar do usuário"
                onError={(e) => {
                  e.target.src =
                    "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=200";
                }}
              />
            </div>
            <div className="profile-info">
              <h1>Minha Conta</h1>
              <p>Visualize suas informações pessoais.</p>
            </div>
            <div className="Change-theme">
              <Button
                type="button"
                className={isDark ? "moon-button" : "sun-button"}
                onClick={toggle}
                aria-label="Alternar tema"
                buttonText={
                  isDark ? (
                    <FiMoon className="moon-icon" />
                  ) : (
                    <FiSun className="sun-icon" />
                  )
                }
              />
            </div>
          </header>

          <InfoCards onEmailLoaded={handleEmailLoaded} />

          <div className="profile-buttons">
            <Button
              className="btn btn-medium"
              onClick={handleOpenConfirm}
              disabled={!email}
              buttonText="Alterar Dados"
            />
            <Button
              className="btn btn-medium"
              onClick={handleOpenConfirm}
              disabled={!email}
              buttonText="Alterar Senha"
            />
          </div>

          {/* Dialog 1: confirmação */}
          <dialog ref={confirmDialogRef} className="close-dialog">
            <h2>Alterar senha</h2>
            <p>
              Um código será enviado para <strong>{email}</strong> Deseja
              continuar?
            </p>
            {message && (
              <p className={`form-message ${message.type}`}>{message.text}</p>
            )}
            <div className="dialog-actions">
              <Button
                className="rejected-btn"
                onClick={handleCancelConfirm}
                disabled={loading}
                buttonText="Cancelar"
              />
              <Button
                className="approved-btn"
                onClick={handleConfirmSendCode}
                disabled={loading}
                buttonText={loading ? "Enviando..." : "Enviar código"}
              />
            </div>
          </dialog>

          {/* Dialog 2: código + nova senha */}
          <dialog ref={formDialogRef} className="close-dialog">
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
                <span
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
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
                <span
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {message && (
                <p className={`form-message ${message.type}`}>{message.text}</p>
              )}
              <div className="dialog-actions">
                <Button
                  type="button"
                  className="rejected-btn"
                  onClick={handleCancelForm}
                  disabled={loading}
                  buttonText="Cancelar"
                />
                <Button
                  type="submit"
                  className="approved-btn"
                  disabled={loading}
                  buttonText={loading ? "Enviando..." : "Confirmar"}
                />
              </div>
            </form>
          </dialog>
        </div>
      </main>
    </div>
  );
};

export default UserStats;
