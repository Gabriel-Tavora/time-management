import React, { useEffect, useState } from "react";
// Components
import Sidebar from "../../components/Layouts/SideBar/SideBar.jsx";
import DashboardHeader from "../../components/Layouts/Dashboard/DashboardHeader.jsx";
import MenagerTable from "../../components/Tables/MenagerTable/MenagerTable.jsx"
// CSS
import "./Menager.css";
//Context
import { useAuthValue } from "../../context/TokenContext.jsx";
// Services
import { getCurrentUser } from "../../services/userData.js";
import {
  getClousedMonthRecords,
  getClousedMonthManager,
  closeApprovedMonthManager,
  closeRejectedMonthManager,
} from "../../services/clousedData.js";
//Utils
import { getCurrentDate } from "../../utils/formatHours.js";

const Menager = () => {
  const [user, setUser] = useState(null);
  const [closedData, setClosedData] = useState([]);
  const [colaboratorData, setColaboratorData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idMonth, setIdMonth] = useState(null);
  const { formatted } = getCurrentDate();
  const { token } = useAuthValue();

  async function loadingData() {
    try {
      const closedList = await getClousedMonthManager(token);
      console.log(closedList)
      
      setClosedData(closedList.id);
      setIdMonth(closedList?.exercice_id);

      if (closedList?.id) {
        const records = await getClousedMonthRecords(
          token,
          closedList.id,
        );
        setColaboratorData(records);
      }

      const userInformations = await getCurrentUser(token);
      setUser(userInformations);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    if (token) {
      loadingData();
    }
  }, [token]);

  const Approval = async () => {
    if (!idMonth || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await closeApprovedMonthManager(token, idMonth);
      setClosedData((prev) => prev.filter((c) => c.id !== idMonth));
      setColaboratorData([]);
      setIdMonth(null);
    } catch (e) {
      console.error(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Rejected = async () => {
    try {
      await closeRejectedMonthManager(token, idMonth);
    } catch (e) {
      console.error(e.message);
    }
  };
  return (
    <div className="Manager-screen">
      <Sidebar />
      <main className="main-informations">
        <DashboardHeader user={user} formatted={formatted} />

        <ul className="main-menu">
          <li>
            <h2>Manager</h2>
          </li>
        </ul>

        <div className="Manager-tables">
          <MenagerTable
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

export default Menager;
