import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuthValue } from "../../context/TokenContext.jsx";
import { getEmployeePerformance } from "../../services/overtimeData.js";

export function useCoordinatorUsers(records, idMonth) {
  const { token } = useAuthValue();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentEmployeePerformace, setCurrentEmployeePerformace] =
    useState(null);

  const users = useMemo(() => {
    if (!Array.isArray(records) || records.length === 0) {
      return [];
    }

    const groupedUsers = records.reduce((acc, data) => {
      const user = data?.users;

      if (!user?.id) {
        return acc;
      }

      const userId = user.id;

      if (!acc[userId]) {
        acc[userId] = {
          id: userId,
          name: user.name,
          records: [],
        };
      }

      acc[userId].records.push({
        ...data.overtime_record,
        hours_by_type: data.hours_by_type ?? {},
      });

      return acc;
    }, {});

    return Object.values(groupedUsers);
  }, [records]);

  const total = users.length;
  const currentUser =
    total > 0
      ? users[currentIndex]
      : null;

  useEffect(() => {
    if (total === 0) {
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex((current) =>
      Math.min(current, total - 1)
    );
  }, [total]);

  useEffect(() => {
    if (
      !currentUser ||
      !token ||
      !idMonth
    ) {
      setCurrentEmployeePerformace(null);
      return;
    }

    let cancelled = false;

    async function loadPerformace() {
      try {
        const performace = await getEmployeePerformance(
          token,
          currentUser.id,
          idMonth
        );

        if (!cancelled) {
          setCurrentEmployeePerformace(performace);
        }
      } catch (error) {
        console.error(
          "Erro ao buscar performace do colaborador:",
          error
        );

        if (!cancelled) {
          setCurrentEmployeePerformace(null);
        }
      }
    }

    loadPerformace();

    return () => {
      cancelled = true;
    };
  }, [
    currentUser?.id,
    token,
    idMonth,
  ]);

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
    users,
    currentUser,
    total,
    currentIndex,
    currentEmployeePerformace,
    goNext,
    goPrev,
  };
}