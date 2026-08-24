import { useEffect, useState } from "react";

// utils
import { getCurrentDate } from "../../utils/formatHours.js";

// context
import { useAuthValue } from "../../context/TokenContext.jsx";

// services
import { getCurrentUser } from "../../services/userData.js";
import {
  getClousedMonth,
  getClousedMonthRecords,
  closeApprovedMonth,
  closeRejectedMonth,
} from "../../services/clousedData.js";

export function useCoordinator() {
  const [user, setUser] = useState(null);
  const [closedData, setClosedData] = useState([]);
  const [colaboratorData, setColaboratorData] = useState([]);

  // ID do fechamento
  const [idClosure, setIdClosure] = useState(null);
  // ID da competência/exercício
  const [idMonth, setIdMonth] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formatted } = getCurrentDate();
  const { token } = useAuthValue();

  async function loadData() {
    if (!token) return;

    try {
      const closedList = await getClousedMonth(token);
      setClosedData(closedList ?? []);
      const currentClosure = closedList?.[0];

      if (!currentClosure) {
        setIdClosure(null);
        setIdMonth(null);
        setColaboratorData([]);
        return;
      }

      setIdClosure(currentClosure.exercice_id ?? null);
      setIdMonth(currentClosure.exercice_id ?? null);

      if (currentClosure.id) {
        const records = await getClousedMonthRecords(
          token,
          currentClosure.id
        );

        setColaboratorData(records ?? []);
      }

      const userInformations = await getCurrentUser(token);

      setUser(userInformations);
    } catch (error) {
      console.error("Erro ao carregar dados do Coordinator:", error);

      setClosedData([]);
      setColaboratorData([]);
    }
  }

  useEffect(() => {
    loadData();
  }, [token]);

  const Approval = async () => {
    if (!idClosure || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await closeApprovedMonth(token, idClosure);

      setClosedData((prev) =>
        prev.filter((closure) => closure.id !== idClosure)
      );

      setColaboratorData([]);

      setIdClosure(null);
      setIdMonth(null);
    } catch (error) {
      console.error("Erro ao aprovar fechamento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Rejected = async () => {
    if (!idClosure || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await closeRejectedMonth(token, idClosure);

      setClosedData((prev) =>
        prev.filter((closure) => closure.id !== idClosure)
      );

      setColaboratorData([]);

      setIdClosure(null);
      setIdMonth(null);
    } catch (error) {
      console.error("Erro ao rejeitar fechamento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    loadData,
    Approval,
    Rejected,
    user,
    colaboratorData,
    formatted,
    idClosure,
    idMonth,
    closedData,
    isSubmitting,
  };
}