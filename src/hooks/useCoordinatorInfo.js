import { useEffect, useState } from "react";
//utils
import { getCurrentDate } from "../utils/formatHours.js";
// Services
import { getCurrentUser } from "../services/userData.js";
import {
  getClousedMonth,
  getClousedMonthRecords,
  closeApprovedMonth,
  closeRejectedMonth,
} from "../services/clousedData.js";
//context
import { useAuthValue } from "../context/TokenContext.jsx";


export function useCoordinator() {
  
  const [user, setUser] = useState(null);
  const [closedData, setClosedData] = useState([]);
  const [colaboratorData, setColaboratorData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idMonth, setIdMonth] = useState(null);
  const { formatted } = getCurrentDate();
  const { token } = useAuthValue();

  async function loadData() {
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

  useEffect(() => {
    if (token) {
      loadData();
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
  return {
    loadData,
    Approval,
    Rejected,
    user,
    colaboratorData,
    formatted,
    idMonth
  };
}