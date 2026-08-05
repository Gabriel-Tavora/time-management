// formatar hora extras
export function formatHours(decimalHours) {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
export function formatHousDay(time) {
  return time.slice(11, 16);
}
// receber formatar hora extras UserScreen
export function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
}

// formatar data para enviar pelo RegisterHour
export function formatDataSend(workDate, time = null) {
  if (time) {
    return `${workDate}T${time}:00Z`;
  }

  return `${workDate}T00:00:00Z`;
}

//buscar horas do pc do usuário
export function getCurrentDate() {
  const date = new Date();

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  // Primeiro dia do mês
  const firstDate = `${year}-${month}-01`;

  // Último dia do mês
  const lastDayNumber = new Date(year, date.getMonth() + 1, 0).getDate();
  const lastDate = `${year}-${month}-${String(lastDayNumber).padStart(2, "0")}`;

  const firstDay = new Date(year, date.getMonth(), 1).getDay();
  const daysInMonth = lastDayNumber;

  return {
    day,
    month,
    year,

    firstDay,
    daysInMonth,

    formatted: `${day}/${month}/${year}`,
    formattedPost: `${year}-${month}-${day}`,

    monthStart: firstDate,
    monthEnd: lastDate,
  };
}
