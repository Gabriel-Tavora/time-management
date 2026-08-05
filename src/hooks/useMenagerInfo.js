import React, { useEffect, useState } from "react";

//Utils
import { getCurrentDate } from "../utils/formatHours.js";

//Context
import { useAuthValue } from "../context/TokenContext.jsx";

// Services
import { getCurrentUser } from "../services/userData.js";
import {
  getClousedMonthRecords,
  getClousedMonthManager,
  closeApprovedMonthManager,
  closeRejectedMonthManager,
} from "../services/clousedData.js";

export function useMenager() {
  const [user, setUser] = useState(null);
  const [colaboratorData, setColaboratorData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [closedMonth, setClosedMonth] = useState(null);
  const { formatted } = getCurrentDate();
  const { token } = useAuthValue();

  const loadingData = async () => {
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

  return {
    loadingData,
    Approval,
    Rejected,
    user,
    colaboratorData,
    isSubmitting,
    closedMonth,
    formatted,
  }
}