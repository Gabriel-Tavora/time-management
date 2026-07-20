import React, { useEffect,useState } from "react";
//css
import "./InfoCards.css";
//services
import { getCurrentUser } from "../../../services/userService";
import { useAuthValue } from "../../../context/TokenContext";
const InfoCards = () => {
  const [user, setUser] = useState(null);
  const { token } = useAuthValue();

  useEffect(() => {
    async function loadingData() {
      try {
        const data = getCurrentUser(token);
        setUser(data);
      } catch (e) {
        console.error(error);
      }
    }
  }, [token]);

  return (
    <section className="menu-data">
      <div className="info-card">
        <span>Nome</span>
        <h2>{user?.name}</h2>
      </div>

      <div className="info-card">
        <span>Apelido</span>
        <h2>{user?.display_name}</h2>
      </div>

      <div className="info-card">
        <span>Email</span>
        <h2>{user?.email}</h2>
      </div>

      <div className="info-card">
        <span>Telefone</span>
        <h2>{user?.phone}</h2>
      </div>

      <div className="info-card">
        <span>Cargo</span>
        <h2>Desenvolvedor Front-end</h2>
      </div>

      <div className="info-card">
        <span>Data de Cadastro</span>
        <h2>15/07/2026</h2>
      </div>
    </section>
  );
};

export default InfoCards;
