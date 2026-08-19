export function formatTimeForInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return [
    String(date.getUTCHours()).padStart(2, "0"),
    String(date.getUTCMinutes()).padStart(2, "0"),
  ].join(":");
}

export function formatDateForInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

export const isNightTime = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return false;
  }

  const toMinutes = (time) => {
    const hhmm = time.includes("T") ? time.slice(11, 16) : time;
    const [hours, minutes] = hhmm.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const start = toMinutes(startTime);
  const end = toMinutes(endTime);

  const NIGHT_START = 22 * 60; // 22:00
  const NIGHT_END = 5 * 60;    // 05:00


  const crossesMidnight = end <= start;
  if (crossesMidnight) {
    return true;
  }

  return end > NIGHT_START || start < NIGHT_END;
};