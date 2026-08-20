import { useState } from "react";

export function useRegisterHours() {
  const [startTime, setStartTime] = useState("17:00");
  const [endTime, setEndTime] = useState("");
  const [nightTime, setNightTime] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");

  return {
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    nightTime,
    setNightTime,
    endDate,
    setEndDate,
    startDate,
    setStartDate,
  };
}
