// formatar hora extras
export function formatHours(decimalHours) {
  if (!decimalHours) {
    return "00:00";
  }

  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

// receber formatar hora extras UserScreen
export function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
}

export function formatTime(date) {
  return new Date(date).toLocaleTimeString("pt-BR", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// formatar data para enviar pelo RegisterHour
export function formatDataSend(workDate, time = null) {
  if (time) {
    return `${workDate}T${time}:00Z`;
  }

  return `${workDate}T00:00:00Z`;
}

//formatar data de registro
export function getRowData(register) {
  const record = register?.overtime_record;
  const totalHours = record?.total_hours ?? 0;
  const nightHours = record?.nigth_hours ?? 0;
  const dayHours = Math.max(totalHours - nightHours, 0);
  return { record, totalHours, nightHours, dayHours };
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
