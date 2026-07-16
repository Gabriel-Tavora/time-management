// formatar hora extras
export function formatHours(decimalHours) {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

// formatar hora extras UserScreen
export function formatDate(hours_time_time) {
  return new Date(hours_time_time).toLocaleDateString("pt-BR");
}
// formatar hora extras RegisterHour
export function formatDataSend(workDate, time = null) {
  const dateTime = time
    ? `${workDate}T${time}:00`
    : `${workDate}T00:00:00`;

  return new Date(dateTime).toISOString();
}
//buscar horas do pc do usuário
export function getCurrentDate() {
  const date = new Date();

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return {
    day,
    month,
    year,
    formatted: `${day}-${month}-${year}`,
    formattedPost: `${year}-${month}-${day}`,
  };
}
