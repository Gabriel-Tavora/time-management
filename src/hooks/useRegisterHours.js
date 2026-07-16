import { useState } from "react";

export function useRegisterHours() {
  const [startTime, setStartTime] = useState("17:00");
  const [endTime, setEndTime] = useState("");
  const [nightHours, setNightHours] = useState(0);
  const [workDate, setWorkDate] = useState("");

  return {
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    nightHours,
    setNightHours,
    workDate,
    setWorkDate,
  };
}