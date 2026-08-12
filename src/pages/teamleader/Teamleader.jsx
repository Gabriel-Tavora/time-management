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
    idMonth,
    message,
    colaboratorData,
    dataTime,
    user,
  } = useTeamLeader();

  return (
    <div className="dashboard-screen">
      <Sidebar />

      <main className="main-informations">
        <DashboardHeader
          user={user}
          formatted={formatted}
        />


        <div className="Leader-tables main-menu">
          <TeamLeaderTable
            data={colaboratorData}
            handleCloseMonth={handleCloseMonth}
            reloadData={loadData}
            idMonth={idMonth}
          />
        </div>
      </main>
    </div>
  );
};

export default Teamleader;
