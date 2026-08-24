// Components
import Sidebar from "../../components/Layouts/SideBar/SideBar.jsx";
import DashboardHeader from "../../components/Layouts/Dashboard/DashboardHeader.jsx";
import MenagerTable from "../../components/Tables/MenagerTable.jsx"

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
          <MenagerTable
            data={colaboratorData}
            onApprove={Approval}
            onReject={Rejected}
            idMonth={idMonth}
          />
        </div>
      </main>
    </div>
  );
};

export default Menager;
