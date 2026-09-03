import React, { useEffect, useState } from "react";
// Components
import Sidebar from "../../components/Layouts/SideBar/SideBar.jsx";
import DashboardHeader from "../../components/common/Dashboard/DashboardHeader.jsx";
import UserTable from "../../components/Tables/UserTable.jsx";
// services
import { getCurrentUser } from "../../services/userData.js";
import { getUserHours, getUserPerformance } from "../../services/overtimeData.js";

//context
import { useAuthValue } from "../../context/TokenContext.jsx";

//Utils
import { getCurrentDate } from "../../utils/formatHours.js";

const UserScreen = () => {
  const [user, setUser] = useState(null);
  const [dataTime, setDataTime] = useState([]);
  const [monthPerf, setMonthPerf] = useState([]);
  const { formatted, monthStart, monthEnd } = getCurrentDate();
  const { token } = useAuthValue();

  async function loadingData() {
    try {
      const userInformations = await getCurrentUser(token);
      setUser(userInformations);
      const dataUserTime = await getUserHours(token);
      setDataTime(dataUserTime);

      const monthPerformace = await getUserPerformance(token, monthStart, monthEnd)
      setMonthPerf(monthPerformace);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (token) {
      loadingData();
    }
  }, [token]);

  return (
    <div className="dashboard-screen">
      <Sidebar />
      <main className="main-informations">
        <DashboardHeader user={user} formatted={formatted} />

        <div className="main-menu">
          <UserTable data={dataTime} monthPerf={monthPerf} token={token} />
        </div>
        
      </main>
    </div>
  );
};

export default UserScreen;
