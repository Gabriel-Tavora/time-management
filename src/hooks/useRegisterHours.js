import { useState } from "react";

export function useRegisterHours() {
  const [startTime, setStartTime] = useState("17:00");
  const [endTime, setEndTime] = useState("");
  const [nightTime, setNightTime] = useState(false);
  const [workDate, setWorkDate] = useState("");

  return {
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    nightTime,
    setNightTime,
    workDate,
    setWorkDate,
  };
}