// Services
import { getCurrentUser } from "../../services/userData.js";
import { employeeDataRecord, getUserHours } from '../../services/overtimeData.js';
//react 
import { useEffect, useState } from "react";

export function useTeamLeader(token) {
  const [user, setUser] = useState(null);
  const [dataTime, setDataTime] = useState([]);
  const [colaboratorData, setColaboratorData] = useState([]);
  const [message, setMessage] = useState(null);
  const [month, setMonth] = useState(null);

  async function loadData() {
    try {
      const infoMonth = await employeeDataMonth(token);
      setMonth(infoMonth);

      const [responseData, userInformations, dataUserTime] =
        await Promise.all([
          employeeDataRecord(token, infoMonth?.id),
          getCurrentUser(token),
          getUserHours(token),
        ]);

      setColaboratorData(responseData);
      setUser(userInformations);
      setDataTime(dataUserTime);
    } catch (error) {
      console.error(error);
    }
  }
  async function closeCurrentMonth() {
    setMessage(null);

    try {
      await closeMonth(token, month?.id);

      await loadData();

      setMessage({
        type: "success",
        text: "Mês fechado com sucesso.",
      });
      return true;
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text: error.message || "Erro ao fechar o mês.",
      });

      return false;
    }
  }

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  return {
    user,
    dataTime,
    colaboratorData,
    message,
    month,
    loadData,
    closeCurrentMonth,
  };
}

