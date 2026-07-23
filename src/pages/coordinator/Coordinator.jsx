import React, { useEffect, useState } from "react";
// Components
import Sidebar from "../../components/SideBar/SideBar.jsx";
import DashboardHeader from "../../components/Dashboard/DashboardHeader.jsx";
import CoordinatorTable from "../../components/CoordinatorTable/CoordinatorTable.jsx";
// CSS
import "./coordinator.css";
//Context
import { useAuthValue } from "../../context/TokenContext";
// Services
import { getCurrentUser } from "../../services/userData.js";
import {
  getClousedMonth,
  getClousedMonthRecords,
  closeApprovedMonth,
  closeRejectedMonth,
} from "../../services/clousedData.js";
//Utils
import { getCurrentDate } from "../../utils/formatHours.js";

const Coordinator = () => {
  const [user, setUser] = useState(null);
  const [closedData, setClosedData] = useState([]);
  const [colaboratorData, setColaboratorData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idMonth, setIdMonth] = useState(null);
  const { formatted } = getCurrentDate();
  const { token } = useAuthValue();

  useEffect(() => {
    async function loadingData() {
      try {
        const closedList = await getClousedMonth(token);
        setClosedData(closedList);

        const currentClosure = closedList?.[0];
        setIdMonth(currentClosure?.exercice_id);

        if (currentClosure?.id) {
          const records = await getClousedMonthRecords(
            token,
            currentClosure.id,
          );
          setColaboratorData(records);
        }

        const userInformations = await getCurrentUser(token);
        setUser(userInformations);
      } catch (error) {
        console.error(error);
      }
    }

    if (token) {
      loadingData();
    }
  }, [token]);

  const Approval = async () => {
  if (!idMonth || isSubmitting) return;
  setIsSubmitting(true);

  try {
    await closeApprovedMonth(token, idMonth);
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
      await closeRejectedMonth(token, idMonth);
    } catch (e) {
      console.error(e.message);
    }
  };
  return (
    <div className="Coordinator-screen">
      <Sidebar />
      <main className="main-informations">
        <DashboardHeader user={user} formatted={formatted} />

        <ul className="main-menu">
          <li>
            <h2>Coordinator</h2>
          </li>
        </ul>

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
