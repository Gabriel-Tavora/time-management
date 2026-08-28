// Components
import Sidebar from "../../components/Layouts/SideBar/SideBar.jsx";
import DashboardHeader from "../../components/common/Dashboard/DashboardHeader.jsx";
import TableMenagerAndCoordinator from "../../components/Tables/TableMenagerAndCoordinator.jsx"

//hooks
import { useMenager } from '../../hooks/useMenager/useMenagerInfo.js';

const Menager = () => {
  const {
    loadingData,
    Approval,
    Rejected,
    user,
    colaboratorData,
    isSubmitting,
    closedMonth,
    formatted,
    idMonth,
  } = useMenager();
  return (
    <div className="dashboard-screen">
      <Sidebar />
      <main className="main-informations">
        <DashboardHeader user={user} formatted={formatted} />

        <div className="Manager-tables">
          <TableMenagerAndCoordinator
            data={colaboratorData}
            Approval={Approval}
            Rejected={Rejected}
            idMonth={idMonth}
          />
        </div>
      </main>
    </div>
  );
};

export default Menager;
