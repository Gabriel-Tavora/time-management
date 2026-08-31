import React, { useEffect, useState } from "react";
// Components
import Sidebar from "../../components/Layouts/SideBar/SideBar.jsx";
import DashboardHeader from "../../components/common/Dashboard/DashboardHeader.jsx";
import SuperAdminTable from "../../components/Tables/SuperAdminTable.jsx";

// services
import { getCurrentUser } from "../../services/userData.js";
import { getUserHours } from "../../services/overtimeData.js";

//context
import { useAuthValue } from "../../context/TokenContext.jsx";

//Utils
import { getCurrentDate } from "../../utils/formatHours.js";

const SuperAdmin = () => {
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
    <div className="dashboard-screen">
      <Sidebar />
      <main className="main-informations">
        <DashboardHeader user={user} formatted={formatted} />

        <div className="main-menu">
          <SuperAdminTable />
        </div>

      </main>
    </div>
  );
};

export default SuperAdmin;
