import { useEffect, useState } from "react";
// Services
import { employeeDataMonth, closeMonth } from '../services/exerciceData.js';
import { employeeDataRecord } from '../services/overtimeData.js';
import {getCurrentUser} from "../services/userData.js"
//utils
import { getCurrentDate } from "../utils/formatHours.js";
//context
import { useAuthValue } from "../context/TokenContext.jsx";

export function useTeamLeader() {
  const [user, setUser] = useState(null);
  const [colaboratorData, setColaboratorData] = useState([]);
  const [message, setMessage] = useState(null);
  const [idMonth, setIdMonth] = useState(null);
  const { token } = useAuthValue();
  const { formatted} = getCurrentDate();

  const loadData = async () => {
    try {
      const userInformations = await getCurrentUser(token);
      setUser(userInformations);
      
      const infoMonth = await employeeDataMonth(token);
      setIdMonth(infoMonth);

      const responseData = await employeeDataRecord(token, infoMonth?.id);
      setColaboratorData(responseData);


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

      throw error;
    }
  };

  return {
    handleCloseMonth,
    loadData,
    formatted,
    idMonth,
    message,
    colaboratorData,
    user,
  };
}