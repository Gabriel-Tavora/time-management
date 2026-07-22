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
  // User Data
  const [user, setUser] = useState(null);
  const [dataTime, setDataTime] = useState([]);
  const [colaboratorData,setColaboratorData] = useState([]);
  const [idMonth, setIdMonth] = useState([]);
  // time Data
  const { formatted } = getCurrentDate();
  //token
  const { token } = useAuthValue();

  //buscar dados dos usuários
  useEffect(() => {
    async function loadingData() {
      try {

        const infoMonth = await employeeDataMonth(token);
        console.log(infoMonth);
        await setIdMonth(infoMonth);

        //------------------------

        const responseData = await employeeDataRecord(token, infoMonth?.id);
        console.log(responseData);
        await setColaboratorData(responseData);
        
        // --------------------------
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

  const handleCloseMoth = async () => {
    try{
      await closeMonth(token, idMonth?.id);
    }catch(e){
      console.error(e.message);
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
