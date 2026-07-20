import React, { useEffect, useState } from "react";
// Components
import Sidebar from "../../components/SideBar/SideBar.jsx";
import DashboardHeader from "../../components/Dashboard/DashboardHeader.jsx";
import OvertimeTable from "../../components/OvertimeTable/OvertimeTable.jsx";
// CSS
import "./UserScreen.css";

// Auth
import { useAuthValue } from "../../context/TokenContext.jsx";
import { getCurrentUser } from "../../services/userService.js";
import { getUserHours } from "../../services/userHours.js";

//Utils
import { getCurrentDate } from "../../utils/formatHours.js";
const UserScreen = () => {
  // User Data
  const [user, setUser] = useState(null);
  const [dataTime, setDataTime] = useState([]);
  // time Data
  const { formatted } = getCurrentDate();
  //token
  const { token } = useAuthValue();

  //buscar dados dos usuários
  useEffect(() => {
    async function loadingData() {
      try {
        const userInformations = await getCurrentUser(token);
        setUser(userInformations);
        const dataUserTime = await getUserHours(token);
        setDataTime(dataUserTime);
        console.log(dataUserTime);
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
        <DashboardHeader user={user} formatted={formatted} />

        <ul className="main-menu">
          <li>
            <h2>Total de Horas Extras</h2>
            <h2>No Mês</h2>
          </li>
        </ul>

        <OvertimeTable data={dataTime} />
      </main>
    </div>
  );
};

export default UserScreen;
