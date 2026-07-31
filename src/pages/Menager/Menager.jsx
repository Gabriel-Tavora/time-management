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
  const [colaboratorData, setColaboratorData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [closedMonth, setClosedMonth] = useState(null);
  const { formatted } = getCurrentDate();
  const { token } = useAuthValue();

  async function loadingData() {
    try {
      const closedList = await getClousedMonthManager(token);
      setClosedMonth(closedList);

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
    if (!closedMonth || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await closeApprovedMonthManager(token, closedMonth.exercice_id);

      setClosedMonth(null);
      setColaboratorData([]);
    } catch (e) {
      console.error(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Rejected = async () => {
    if (!closedMonth || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await closeRejectedMonthManager(token, closedMonth.exercice_id);

      setClosedMonth(null);
      setColaboratorData([]);
    } catch (e) {
      console.error(e.message);
    } finally {
      setIsSubmitting(false);
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
            disabled={!closedMonth?.exercice_id}
          />
        </div>
      </main>
    </div>
  );
};

export default Menager;
