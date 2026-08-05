import { useEffect, useState } from "react";

// Services
import { employeeDataAll, employeeDataMonth, closeMonth } from '../services/exerciceData.js';
import { employeeDataRecord, getUserHours, getUserPerformance } from '../services/overtimeData.js';
import { getCurrentUser } from "../services/userData.js";

//utils
import { getCurrentDate } from "../utils/formatHours.js";

//context
import { useAuthValue } from "../context/TokenContext.jsx";

export function useTeamLeader() {
  const [user, setUser] = useState(null);
  const [dataTime, setDataTime] = useState([]);
  const [colaboratorData, setColaboratorData] = useState([]);
  const [message, setMessage] = useState(null);
  const [monthPerf, setMonthPerf] = useState([]);
  const [idMonth, setIdMonth] = useState(null);

  const { token } = useAuthValue();
  const { formatted, monthStart, monthEnd } = getCurrentDate();

  const loadData = async () => {
    try {
      const infoMonth = await employeeDataMonth(token);
      setIdMonth(infoMonth);

      const responseData = await employeeDataRecord(token, infoMonth?.id);
      setColaboratorData(responseData);

      const userInformations = await getCurrentUser(token);
      setUser(userInformations);

      const dataUserTime = await getUserHours(token);
      setDataTime(dataUserTime);

      const monthPerformance = await getUserPerformance(token, monthStart, monthEnd);
      setMonthPerf(monthPerformance);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const handleCloseMonth = async () => {
    setMessage(null);

    try {
      await closeMonth(token, idMonth?.id);
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
  };

  return {
    handleCloseMonth,
    loadData,
    formatted,
    monthStart,
    monthEnd,
    idMonth,
    monthPerf,
    message,
    colaboratorData,
    dataTime,
    user,
  };
}