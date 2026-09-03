import { useEffect, useState } from "react";

// services
import { getUserHours } from "../services/overtimeData.js";

// context
import { useAuthValue } from "../context/TokenContext.jsx";

export function useCalendary() {
  const { token } = useAuthValue();

  const [overtimeRecords, setOvertimeRecords] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    async function loadingData() {
      setErrorMessage(null);

      try {
        const userData = await getUserHours(token);

        setOvertimeRecords(userData);
      } catch (error) {
        console.error(error);

        setErrorMessage(
          error?.message || "Erro ao carregar horas extras."
        );
      }
    }

    if (token) {
      loadingData();
    }
  }, [token]);

  return {
    overtimeRecords,
    errorMessage,
  };
}