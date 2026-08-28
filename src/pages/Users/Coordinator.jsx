import React, { useEffect, useState } from "react";
// Components
import Sidebar from "../../components/Layouts/SideBar/SideBar.jsx";
import DashboardHeader from "../../components/common/Dashboard/DashboardHeader.jsx";
import TableMenagerAndCoordinator from "../../components/Tables/TableMenagerAndCoordinator.jsx";

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
    closedData,
    isSubmitting,
  } = useCoordinator();

  return (
    <div className="dashboard-screen">
      <Sidebar />
      <main className="main-informations">
        <DashboardHeader user={user} formatted={formatted} />

        <div className="Coordinator-tables">
          <TableMenagerAndCoordinator
            data={colaboratorData}
            idMonth={idClosure}
            Approval={Approval}
            Rejected={Rejected}
          />
        </div>
      </main>
    </div>
  );
};

export default Coordinator;
