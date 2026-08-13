import { useCallback, useEffect, useMemo, useState } from "react";
//services
import { getEmployeePerformance } from '../services/overtimeData';
//context
import { useAuthValue } from "../context/TokenContext.jsx";
export function useGroupUsers(records, idMonth) {
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
  const { token } = useAuthValue();
  const [currentEmployeePerformace, setCurrentEmployeePerformace] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = items.length;
  const hasNext = currentIndex < total - 1;
  const hasPrev = currentIndex > 0;
  const currentItem = total > 0 ? items[currentIndex] : null;
  const idExercice = idMonth?.id;

  console.log(currentEmployeePerformace)
  useEffect(() => {
    if (total === 0) {
      setCurrentIndex(0);
      return;
    }
    if (currentIndex > total - 1) {
      setCurrentIndex(total - 1);
    }
    getPerformace();
  }, [total, currentIndex]);

  const getPerformace = async () => {
    const performace = await getEmployeePerformance(token, currentItem.id, idExercice);
    setCurrentEmployeePerformace(performace);
  }

  const goNext = useCallback(() => {
    setCurrentIndex((index) => Math.min(index + 1, total - 1));
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }, []);

  const goToIndex = useCallback(
    (index) => {
      if (index < 0 || index > total - 1) return;
      setCurrentIndex(index);
    },
    [total]
  );

  return {
    items,
    currentItem,
    currentIndex,
    total,
    hasNext,
    hasPrev,
    currentEmployeePerformace,
    goNext,
    goPrev,
    goToIndex,
  };
}

// Transforma:
// { 5: {...}, 8: {...} }
//
// em:
// [{...}, {...}] itens

/*
 5: {
  name: "Mira Lopes",
  records: [
    {
      id: 8,
      total_hours: 3
    },
    {
      id: 10,
      total_hours: 2
    }
  ]
},

8: {
  name: "João Silva",
  records: [
    {
      id: 15,
      total_hours: 4
    }
  ]
}
*/
