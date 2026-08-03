export function getOvertimeSummary(data = []) {
  return data.reduce(
    (summary, register) => {
      const totalHours = register?.overtime_records?.total_hours ?? 0;
      const nightHours = register?.overtime_records?.nigth_hours ?? 0;
      const dayHours = totalHours - nightHours;

      return {
        totalHours: summary.totalHours + totalHours,
        totalNightHours: summary.totalNightHours + nightHours,
        totalDayHours: summary.totalDayHours + dayHours,
      };
    },
    { totalHours: 0, totalNightHours: 0, totalDayHours: 0 },
  );
}