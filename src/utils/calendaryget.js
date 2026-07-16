export function calendaryGet(currentDate) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();

  return {
    year,
    month,
    firstDay,
    daysInMonth,
    today,
  };
}