import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
//components
import Sidebar from "../../../components/Layouts/SideBar/SideBar";
import InfoCards from "../../../components/Layouts/UserStats/InfoCards.jsx";
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
import "../../../styles/auth.css";
import { FaKey, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";

const UserStats = () => {
  const navigate = useNavigate();
  const formDialogRef = useRef(null);
  const { toggle, isDark } = useTheme();
  const [avatarUrl, setAvatarUrl] = useState(() =>
    getAvatarUrl({ seed: "guest" }),
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEditData = (path) => {
    navigate(path);
  };

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

  const handleCancelForm = () => {
    formDialogRef.current?.close();
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitPassword(code, password);
  };

  const handleOpenConfirm = async () => {
    const result = await Swal.fire({
      title: "Alterar senha",
      text: `Um código será enviado para ${email}. Deseja continuar?`,
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Enviar código",
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: async () => {
        try {
          const response = await sendCode();

          if (!response?.success) {
            Swal.showValidationMessage(
              response?.message || "Não foi possível enviar o código.",
            );

            return false;
          }
          return response;
        } catch (error) {
          Swal.showValidationMessage(
            error?.message || "Erro ao enviar código.",
          );
          return false;
        }
      },
      customClass: {
        popup: "my-swal-popup",
        title: "my-swal-title",
        htmlContainer: "my-swal-text",
        confirmButton: "my-swal-confirm",
        cancelButton: "my-swal-cancel",
        icon: "my-swal-icon",
      },
    });

    if (result.isConfirmed && result.value?.success) {
      formDialogRef.current?.showModal();
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
              onClick={() => handleEditData("/EditUserData")}
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

          {/* Dialog 2: código + nova senha */}
          <dialog ref={formDialogRef} className="login-card close-dialog">
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <h2>Defina a nova senha</h2>
                </div>
              <div className="input-group">
                <FaKey className="input-icon" />
                <input
                  type="text"
                  placeholder="Insira o código"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
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
                  role="button"
                  tabIndex={0}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  minLength={8}
                />
                <span
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  role="button"
                  tabIndex={0}
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar confirmação da senha"
                      : "Mostrar confirmação da senha"
                  }
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {message && (
                <p className={`form-message ${message.type}`}>
                  {message.text}
                </p>
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
