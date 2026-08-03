import React, { useEffect, useState } from "react";

// Components
import Sidebar from "../../components/Layouts/SideBar/SideBar.jsx";
import DashboardHeader from "../../components/Layouts/Dashboard/DashboardHeader.jsx";
import TeamLeaderTable from '../../components/Tables/TeamLeaderTable/TeamLeaderTable.jsx';

// CSS
import "./Teamleader.css";
import "../../styles/global.css"
//Context
import { useAuthValue } from "../../context/TokenContext";

// Services
import { getCurrentUser } from "../../services/userData.js";
import { employeeDataAll, employeeDataMonth, closeMonth } from '../../services/exerciceData.js';
import { employeeDataRecord, getUserHours } from '../../services/overtimeData.js';

//Utils
import { getCurrentDate } from "../../utils/formatHours.js";

const Teamleader = () => {
  const [user, setUser] = useState(null);
  const [dataTime, setDataTime] = useState([]);
  const [colaboratorData, setColaboratorData] = useState([]);
  const [message, setMessage] = useState(null);
  const [idMonth, setIdMonth] = useState([]);
  const { formatted } = getCurrentDate();
  const { token } = useAuthValue();

  const loadData = async () => {
    try {
      const infoMonth = await employeeDataMonth(token);
      setIdMonth(infoMonth);
      console.log(infoMonth)
      const responseData = await employeeDataRecord(token, infoMonth?.id);
      setColaboratorData(responseData);

      const userInformations = await getCurrentUser(token);
      setUser(userInformations);
      console.log(userInformations)
      const dataUserTime = await getUserHours(token);
      setDataTime(dataUserTime);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const handleCloseMonth = async () => {
    setMessage(null);
    try {
      await closeMonth(token, idMonth?.id);
      await loadData();
      setMessage({
        type: "success",
        text: "Mês fechado com sucesso.",
      });
      return true;
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: error.message || "Erro ao fechar o mês.",
      });

      return false;
    }
  };
  return (
    <div className="dashboard-screen">
      <Sidebar />

      <main className="main-informations">
        <div>
          <DashboardHeader
            user={user}
            formatted={formatted}
          />

          <ul className="main-menu">
            <li>
              <h2>Team-Leader</h2>
            </li>
          </ul>
        </div>

        <div className="Leader-tables">
          <TeamLeaderTable
            data={colaboratorData}
            handleCloseMoth={handleCloseMonth}
            reloadData={loadData}
          />
        </div>
      </main>
    </div>
  );
};

export default Teamleader;
