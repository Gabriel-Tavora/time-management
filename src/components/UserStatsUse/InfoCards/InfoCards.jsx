import React, { useEffect, useState } from "react";
//css
import "./InfoCards.css";
//services
import { getCurrentUser } from "../../../services/userData.js";
//context
import { useAuthValue } from "../../../context/TokenContext";
const InfoCards = () => {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);
  const { token } = useAuthValue();

  useEffect(() => {
    async function loadingData() {
      setIsLoadingUser(true);
      setUserError(null);
      try {
        const data = await getCurrentUser(token);
        setUser(data);
      } catch (e) {
        console.error(e);
        setUserError("Não foi possível carregar seus dados. Tente novamente.");
      } finally {
        setIsLoadingUser(false);
      }
    }
    if (token) {
      loadingData();
    }
  }, [token]);

  return (
    <section className="menu-data">
      <div className="info-card">
        <span>Nome</span>
        <h2>{user?.name}</h2>
      </div>

      {user?.display_name && (
        <div className="info-card">
          <span>Apelido</span>
          <h2>{user.display_name}</h2>
        </div>
      )}

      <div className="info-card">
        <span>Email</span>
        <h2>{user?.email}</h2>
      </div>

      <div className="info-card">
        <span>Telefone</span>
        <h2>{user?.phone}</h2>
      </div>
    </section>
  );
};

export default InfoCards;
