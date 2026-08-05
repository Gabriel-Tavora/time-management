import React, { useEffect, useState } from "react";
// Components
import Sidebar from "../../components/Layouts/SideBar/SideBar.jsx";
import DashboardHeader from "../../components/Layouts/Dashboard/DashboardHeader.jsx";
import TeamLeaderTable from '../../components/Tables/TeamLeaderTable/TeamLeaderTable.jsx';

// CSS
import "./Teamleader.css";

//hooks
import { useTeamLeader } from '../../hooks/useTeamLeaderInfo.js';
const Teamleader = () => {
  const {
    handleCloseMonth,
    loadData,
    formatted,
    monthStart,
    monthEnd,
    idMonth,
    monthPerf,
    message,
    colaboratorData,
    dataTime,
    user,
  } = useTeamLeader();

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
            handleCloseMonth={handleCloseMonth}
            reloadData={loadData}
            monthPerf={monthPerf}
          />
        </div>
      </main>
    </div>
  );
};

export default Teamleader;
