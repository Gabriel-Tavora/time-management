import React, { useEffect, useState } from "react";

// Components
import Sidebar from "../../components/SideBar/SideBar.jsx";

// Navigate
import { useNavigate, NavLink } from "react-router-dom";

// CSS
import "./UserScreen.css";
import { FaCalendarAlt, FaPlus } from "react-icons/fa";

// Auth
import { useAuthValue } from "../../context/TokenContext";
import { getCurrentUser } from "../../services/userService";
import { getUserHours } from "../../services/userHours.js";

const UserScreen = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dataTime, setDataTime] = useState([]);

  const { token } = useAuthValue();

  const [currentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");

  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    async function loadingData() {
      try {
        const userInformations = await getCurrentUser(token);

        setUser(userInformations);

        const dataUserTime = await getUserHours(token);

        setDataTime(dataUserTime);
      } catch (error) {
        console.error(error);
      }
    }

    if (token) {
      loadingData();
    }
  }, [token]);

  return (
    <div className="user-screen">
      <Sidebar />

      <main className="main-informations">
        <div className="main-header">
          <div className="main-header-title">
            {user && <h1>Olá, {user?.display_name}</h1>}
            <p>Acompanhe suas Horas Extras.</p>
          </div>

          <div className="main-header-time">
            <h2>
              {month}/{year}
            </h2>
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

            <button onClick={() => handleNavigate("/RegisterHours")}>
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
              {dataTime.map((register) => (
                <tr key={register.overtime_records.id}>
                  <td>{register.users.name}</td>
                  <td>{register.overtime_records.work_date}</td>
                  <td>{register.overtime_records.total_hours}</td>
                  <td>{register.overtime_records.overtime_type_id}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <NavLink>Ver Todos os Meus Registros</NavLink>
        </div>
      </main>
    </div>
  );
};

export default UserScreen;
