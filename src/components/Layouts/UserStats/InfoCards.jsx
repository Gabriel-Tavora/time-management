import React, { useEffect, useState } from "react";
//services
import { getCurrentUser } from "../../../services/userData.js";
//context
import { useAuthValue } from "../../../context/TokenContext.jsx";
const InfoCards = ({ onEmailLoaded }) => {
  const [user, setUser] = useState(null);
  const { token } = useAuthValue();

  async function loadingData() {
    try {
      const data = await getCurrentUser(token);
      setUser(data);
    } catch (e) {
      console.error(e);
    }
  }
  
  useEffect(() => {
    if (user?.email) {
      onEmailLoaded?.(user.email);
    }
  }, [user, onEmailLoaded]);

  useEffect(() => {
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
