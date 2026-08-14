// Components
import Sidebar from "../../components/Layouts/SideBar/SideBar.jsx";
import DashboardHeader from "../../components/Layouts/Dashboard/DashboardHeader.jsx";
import MenagerTable from "../../components/Tables/MenagerTable/MenagerTable.jsx"

//hooks
import { useMenager } from '../../hooks/useMenagerInfo.js';

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
            disabled={!closedMonth?.exercice_id}
          />
        </div>
      </main>
    </div>
  );
};

export default Menager;
