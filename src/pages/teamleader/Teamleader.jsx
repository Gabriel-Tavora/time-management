import React, { useEffect, useState } from "react";
// Components
import Sidebar from "../../components/SideBar/SideBar.jsx";
import DashboardHeader from "../../components/Dashboard/DashboardHeader.jsx";
import TeamLeaderTable from '../../components/TeamLeaderTable/TeamLeaderTable.jsx';
// CSS
import "./Teamleader.css";
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
  const [colaboratorData,setColaboratorData] = useState([]);
  const [idMonth, setIdMonth] = useState([]);
  const { formatted } = getCurrentDate();
  const { token } = useAuthValue();

  
  useEffect(() => {
    async function loadingData() {
      try {
        //id do mês
        const infoMonth = await employeeDataMonth(token);
        await setIdMonth(infoMonth);

        // todas as horas extras do mês
        const responseData = await employeeDataRecord(token, infoMonth?.id);
        await setColaboratorData(responseData);
        
        // --------------------------
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

  const handleCloseMoth = async () => {
    e.preventDefault();
    setMessage(null);
    try{
      await closeMonth(token, idMonth?.id);
      setMessage("");
    }catch(e){
      console.error(e.message);
      setMessage("Informe o horário de saída!");
    }
  };
  return (
    <div className="Leader-screen">
      <Sidebar />
      <main className="main-informations">
        <DashboardHeader user={user} formatted={formatted} />

        <ul className="main-menu">
          <li>
            <h2>Team-Leader</h2>
          </li>
        </ul>

        <div className="Leader-tables">
          <TeamLeaderTable 
          data={colaboratorData} 
          handleCloseMoth={handleCloseMoth}
          />
        </div>
      </main>
    </div>
  );
};

export default Teamleader;
