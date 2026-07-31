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
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return {
    day,
    month,
    year,
    firstDay,
    daysInMonth,
    formatted: `${day}/${month}/${year}`,
    formattedPost: `${year}-${month}-${day}`,
  };
}
