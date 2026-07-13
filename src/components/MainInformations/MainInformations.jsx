//react
import React, { useEffect, useState } from "react";
//navigate
import { useNavigate, NavLink } from "react-router-dom";
// CSS
import { FaCalendarAlt, FaPlus } from "react-icons/fa";
import "./MainInformations.css";
//Auth
import { useAuthValue } from '../../context/TokenContext';
import { getCurrentUser } from "../../services/userService";

const MainInformations = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [registros, setRegistros] = useState([]);
  // 
  const { token } = useAuthValue();
  //dataTime
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(1, "0");


  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    async function carregarDados() {
      try {
        const usuario = await getCurrentUser(token);

        setUser(usuario);

        const dados = await getUserHours(usuario.id);

        setRegistros(dados);
      } catch (err) {
        console.error(err);
      }
    }

    if (token) {
      carregarDados();
    }
  }, [token]);
  return (
    <aside className="main-informations">
      <div className="main-header">
        <div className="main-header-title">
          {user != null && (
            <h1>Olá, {user?.displayName}</h1>
          )}
          <p>Acompanhe suas Horas Extras.</p>
        </div>

        <div className="main-header-time">
          <h2>0{month}/{year}</h2>
          <FaCalendarAlt />
        </div>
      </div>

      <ul className="main-menu">
        <li>
          <h2>Total de Horas Extras</h2>
          <h2></h2>
          <h2>No Mês</h2>
        </li>
      </ul>

      <div className="main-register">
        <div className="main-register-title">
          <h2>Meus Registros de Horas Extras</h2>
          <button onClick={() => { handleNavigate("/RegisterHours") }}>
            <FaPlus />
            Registrar Hora Extra
          </button>
        </div>

        <table className="main-register-stats">
          <thead className="main-register-stats-head">
            <tr className="main-register-stats-head-tr">
              <th>Funcionário</th>
              <th>Data</th>
              <th>Horas Extras</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody className="main-register-stats-body">
            {registros.map((registro) => (
              <tr key={registro.id}>
                <td>{user?.nome}</td>
                <td>{registro.data}</td>
                <td>{registro.horas}</td>
                <td>{registro.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <NavLink>Ver Todos os Meus Registros</NavLink>
      </div>
    </aside>
  );
};

export default MainInformations;
