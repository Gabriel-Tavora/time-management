import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_AUTO_CLOSE_MS = 5000;

export const useEditTimeout = (autoCloseMs = DEFAULT_AUTO_CLOSE_MS) => {
  const [editTime, setEditTime] = useState(null);

  const timeoutRef = useRef(null);
  const containerRef = useRef(null);

  const clearEditTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleEditTime = useCallback(
    (id) => {
      clearEditTimeout();

      setEditTime(id);

      timeoutRef.current = setTimeout(() => {
        setEditTime(null);
        timeoutRef.current = null;
      }, autoCloseMs);
    },
    [autoCloseMs, clearEditTimeout]
  );

  const closeEdit = useCallback(() => {
    clearEditTimeout();
    setEditTime(null);
  }, [clearEditTimeout]);

  useEffect(() => {
    if (editTime === null) return;

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        closeEdit();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editTime, closeEdit]);

  useEffect(() => {
    return () => {
      clearEditTimeout();
    };
  }, [clearEditTimeout]);
  
  return {
    editTime,
    containerRef,
    handleEditTime,
    closeEdit,
  };
};