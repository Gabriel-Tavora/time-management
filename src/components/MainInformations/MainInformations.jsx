import React, { useEffect, useState } from "react";
import { useNavigate,NavLink } from "react-router-dom";
// CSS
import { FaCalendarAlt, FaPlus } from "react-icons/fa";
import "./MainInformations.css";

const MainInformations = () => {

  const [user, setUser] = useState(null);
  const [registros, setRegistros] = useState([]);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    async function carregarDados() {
      const usuario = JSON.parse(localStorage.getItem("user"));

      if (!usuario) return;

      setUser(usuario);

      const dados = await getUserHours(usuario.id);

      setRegistros(dados);
    }

    carregarDados();
  }, []);

  return (
    <aside className="main-informations">
      <div className="main-header">
        <div className="main-header-title">
          <h1></h1>
          <p>Acompanhe suas Horas Extras.</p>
        </div>

        <div className="main-header-time">
          <h2>Abril/2024</h2>
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
          <button onClick={() => {handleNavigate("/RegisterHours")}}>
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
