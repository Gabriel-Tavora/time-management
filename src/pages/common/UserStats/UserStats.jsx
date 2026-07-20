import React from "react";

// Components
import Sidebar from "../../../components/SideBar/SideBar";
import InfoCards from "../../../components/UserStatsUse/InfoCards/InfoCards";
// CSS
import "./UserStats.css";

const UserStats = () => {
  return (
    <div className="stats">
      <Sidebar />

      <main className="menu-stats">
        <form className="menu-stats-cont">
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
          </header>

          <InfoCards />

          <div className="profile-buttons">
            <button className="btn-primary">Editar Perfil</button>
            <button className="btn-secondary">Alterar Senha</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default UserStats;
