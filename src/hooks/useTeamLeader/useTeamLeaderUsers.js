import { useCallback, useEffect, useMemo, useState } from "react";
//services
import { getEmployeePerformance } from "../../services/overtimeData";
//context
import { useAuthValue } from "../../context/TokenContext.jsx";

import { getMonthOncall } from '../../services/contractData'
export function useTeamLeaderUsers(records, idMonth) {

  const { token } = useAuthValue();

  const items = useMemo(() => {
    const filterUserById = records.reduce((acc, data) => {
      const userId = data.users.id;

      if (!acc[userId]) {
        acc[userId] = {
          id: userId,
          name: data.users.name,
          records: [],
        };
      }

      acc[userId].records.push({
        ...data.overtime_records,
        hours_by_type: data.hours_by_type,
      });

      return acc;
    }, {});

    return Object.values(filterUserById);
  }, [records]);


  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentEmployeePerformace, setCurrentEmployeePerformace] =
    useState(null);

  const total = items.length;

  const currentItem = total > 0
    ? items[currentIndex]
    : null;

  const idExercice = idMonth?.id;

  useEffect(() => {
    if (total === 0) {
      setCurrentIndex(0);
      return;
    }

    if (currentIndex > total - 1) {
      setCurrentIndex(total - 1);
    }
  }, [total, currentIndex]);

  useEffect(() => {
    if (!currentItem || !token || !idExercice) {
      setCurrentEmployeePerformace(null);
      return;
    }

    const getPerformance = async () => {
      try {

        const performance = await getEmployeePerformance(
          token,
          currentItem.id,
          idExercice
        );

        setCurrentEmployeePerformace(performance);
      } catch (error) {
        console.error(error);
        setCurrentEmployeePerformace(null);
      }
    };

    getPerformance();
  }, [currentItem, token, idExercice, idMonth]);

  const goNext = useCallback(() => {
    setCurrentIndex((index) =>
      Math.min(index + 1, total - 1)
    );
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrentIndex((index) =>
      Math.max(index - 1, 0)
    );
  }, []);
  return {
    currentItem,
    total,
    currentEmployeePerformace,
    goNext,
    goPrev,
  };
}