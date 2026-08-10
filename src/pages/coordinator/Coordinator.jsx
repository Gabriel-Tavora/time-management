import React, { useEffect, useState } from "react";
// Components
import Sidebar from "../../components/Layouts/SideBar/SideBar.jsx";
import DashboardHeader from "../../components/Layouts/Dashboard/DashboardHeader.jsx";
import CoordinatorTable from "../../components/Tables/CoordinatorTable/CoordinatorTable.jsx";
// CSS
import "./Coordinator.css";
//hooks
import { useCoordinator } from '../../hooks/useCoordinatorInfo.js';
const Coordinator = () => {
  const {
    loadData,
    Approval,
    Rejected,
    user,
    colaboratorData,
    formatted,
    idMonth
  } = useCoordinator();
  return (
    <div className="dashboard-screen">
      <Sidebar />
      <main className="main-informations">
        <DashboardHeader user={user} formatted={formatted} />

        <div className="Coordinator-tables">
          <CoordinatorTable
            data={colaboratorData}
            Approval={Approval}
            Rejected={Rejected}
            disabled={!idMonth}
          />
        </div>
      </main>
    </div>
  );
};

export default Coordinator;
