//formatar data de registro
export function getRowData(register) {
  const record = register?.overtime_record;
  const totalHours = record?.total_hours ?? 0;
  const nightHours = record?.nigth_hours ?? 0;
  const dayHours = Math.max(totalHours - nightHours, 0);
  return { record, totalHours, nightHours, dayHours };
}