export const calculateNightHours = (start, end) => {
  const nightStart = 22 * 60; // 22:00 em minutos
  const nightEnd = 24 * 60;   // 00:00 em minutos

  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  let nightMinutes = 0;

  if (endMinutes < startMinutes) {
    const adjustedEnd = endMinutes + 24 * 60;

    if (startMinutes >= nightStart) {
      nightMinutes += adjustedEnd - startMinutes;
    } else if (adjustedEnd > nightStart) {
      nightMinutes += adjustedEnd - nightStart;
    }
  } 
  
  else {
    if (startMinutes >= nightStart) {
      nightMinutes = endMinutes - startMinutes;
    } else if (endMinutes > nightStart) {
      nightMinutes = endMinutes - nightStart;
    }
  }

  return Number((nightMinutes / 60).toFixed(2));
};