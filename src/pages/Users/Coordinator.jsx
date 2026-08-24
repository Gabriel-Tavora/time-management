import React, { useEffect, useState } from "react";
// Components
import Sidebar from "../../components/Layouts/SideBar/SideBar.jsx";
import DashboardHeader from "../../components/Layouts/Dashboard/DashboardHeader.jsx";
import CoordinatorTable from "../../components/Tables/CoordinatorTable.jsx";

//hooks
import { useCoordinator } from '../../hooks/useCoordinator/useCoordinatorInfo.js';
const Coordinator = () => {
  const {
    loadData,
    Approval,
    Rejected,
    user,
    colaboratorData,
    formatted,
    idClosure,
    idMonth,
    closedData,
    isSubmitting,
  } = useCoordinator();
  return (
    <div className="dashboard-screen">
      <Sidebar />
      <main className="main-informations">
        <DashboardHeader user={user} formatted={formatted} />

        <div className="Coordinator-tables">
          <CoordinatorTable
            data={colaboratorData}
            idMonth={idMonth}
            Approval={Approval}
            Rejected={Rejected}
          />
        </div>
      </main>
    </div>
  );
};

export default Coordinator;
