import { useCallback, useEffect, useMemo, useState } from "react";

export function useGroupUsers(records) {
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

      acc[userId].records.push(data.overtime_records);

      return acc;
    }, {});

    return Object.values(filterUserById);
  }, [records]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const total = items.length;

  useEffect(() => {
    if (total === 0) {
      setCurrentIndex(0);
      return;
    }
    if (currentIndex > total - 1) {
      setCurrentIndex(total - 1);
    }
  }, [total, currentIndex]);

  const hasNext = currentIndex < total - 1;
  const hasPrev = currentIndex > 0;

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

  const currentItem = total > 0 ? items[currentIndex] : null;

  return {
    items,
    currentItem,
    currentIndex,
    total,
    hasNext,
    hasPrev,
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
