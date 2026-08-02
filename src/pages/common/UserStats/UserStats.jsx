import React, { useEffect, useState } from "react";
// Components
import Sidebar from "../../../components/Layouts/SideBar/SideBar";
import InfoCards from "../../../components/UserStatsUse/InfoCards/InfoCards";
// CSS
import "./UserStats.css";
import { FiSun, FiMoon } from "react-icons/fi";
const UserStats = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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

          <InfoCards />

          <div className="profile-buttons">
            <button type="button" className="btn-primary">
              Editar Perfil
            </button>
            <button type="button" className="btn-secondary">
              Alterar Senha
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserStats;
