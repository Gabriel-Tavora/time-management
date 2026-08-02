import React, { useEffect, useState } from "react";
// Components
import Sidebar from "../../components/Layouts/SideBar/SideBar.jsx";
import DashboardHeader from "../../components/Layouts/Dashboard/DashboardHeader.jsx";
import UserTable from "../../components/Tables/UserTable/UserTable.jsx";
// CSS
import "./UserScreen.css";

// services
import { getCurrentUser } from "../../services/userData.js";
import { getUserHours } from "../../services/overtimeData.js";

//context
import { useAuthValue } from "../../context/TokenContext.jsx";

//Utils
import { getCurrentDate } from "../../utils/formatHours.js";

const UserScreen = () => {
  const [user, setUser] = useState(null);
  const [dataTime, setDataTime] = useState([]);
  const { formatted } = getCurrentDate();
  const { token } = useAuthValue();

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
        <DashboardHeader user={user} formatted={formatted} />
        <ul className="main-menu">
          <li>
            <h2>Usuário</h2>
          </li>
        </ul>
        <UserTable data={dataTime} />
      </main>
    </div>
  );
};

export default UserScreen;
