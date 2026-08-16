import { Messages } from "../utils/message.js";

const MS_IN_HOUR = 1000 * 60 * 60;
const MS_IN_DAY = MS_IN_HOUR * 24;

export const FUTURE_TOLERANCE_HOURS = 36;
export const MAX_OVERTIME_SPAN_DAYS = 7;


export function buildIsoDateTime(date, time) {
  if (!date || !time) return null;
  return `${date}T${time}:00Z`;
}

export function combineDateTime(date, time) {
  const iso = buildIsoDateTime(date, time);
  return iso ? new Date(iso) : null;
}

function nowAsUtcLabeled() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  return combineDateTime(date, time);
}

function normalizeToDate(value, fallbackTime = "00:00") {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    return value.includes("T")
      ? new Date(value)
      : combineDateTime(value, fallbackTime);
  }
  return null;
}

export function validateOvertime({
  endTime,
  endDate,
  startTime,
  startDate,
  jiraTask,
  monthStart,
  monthEnd,
}) {
  if (!startDate || !endDate) {
    return Messages.REQUIRED_DATE;
  }

  if (!startTime) {
    return Messages.REQUIRED_START;
  }

  if (!endTime) {
    return Messages.REQUIRED_END;
  }

  const start = combineDateTime(startDate, startTime);
  const end = combineDateTime(endDate, endTime);

  const startDay = combineDateTime(startDate, "00:00");
  const endDay = combineDateTime(endDate, "00:00");
  const dayDiff = (endDay - startDay) / MS_IN_DAY;

  if (dayDiff < 0) {
    return Messages.INVALID_DATE_ORDER;
  }

  if (dayDiff > MAX_OVERTIME_SPAN_DAYS) {
    return Messages.INVALID_DATE_RANGE(MAX_OVERTIME_SPAN_DAYS);
  }

  if (end <= start) {
    return Messages.INVALID_TIME;
  }

  const maxAllowedStart = new Date(
    nowAsUtcLabeled().getTime() + FUTURE_TOLERANCE_HOURS * MS_IN_HOUR,
  );

  if (start > maxAllowedStart) {
    return Messages.FUTURE_DATE;
  }

  if (!monthStart || !monthEnd) {
    return Messages.PERIOD_UNAVAILABLE;
  }

  const periodStart = normalizeToDate(monthStart, "00:00");
  const periodEnd = normalizeToDate(monthEnd, "23:59");

  if (!periodStart || !periodEnd || start < periodStart || end > periodEnd) {
    return Messages.OUTSIDE_PERIOD;
  }

  if (!jiraTask.trim()) {
    return Messages.REQUIRED_JIRA;
  }

  const normalizedJira = jiraTask.trim().toUpperCase();
  const jiraRegex = /^[A-Z]+-\d+$/;

  if (!jiraRegex.test(normalizedJira)) {
    return Messages.INVALID_JIRA;
  }

  return null;
}

export function calculateNightHours(start, end) {
  let nightMs = 0;
  const cursor = new Date(start);

  while (cursor < end) {
    const next = new Date(
      Math.min(cursor.getTime() + MS_IN_HOUR, end.getTime()),
    );
    const hour = cursor.getUTCHours();
    const isNight = hour >= 22 || hour < 5;

    if (isNight) {
      nightMs += next.getTime() - cursor.getTime();
    }

    cursor.setTime(next.getTime());
  }

  return nightMs / MS_IN_HOUR;
}

export function isDuplicate(records, startDateTime, endDateTime) {
  return records.some(
    (record) =>
      new Date(record.start_time).getTime() === startDateTime.getTime() &&
      new Date(record.end_time).getTime() === endDateTime.getTime(),
  );
}

export function hasTimeConflict(records, startDateTime, endDateTime) {
  return records.some((record) => {
    const recordStart = new Date(record.start_time);
    const recordEnd = new Date(record.end_time);

    return startDateTime < recordEnd && endDateTime > recordStart;
  });
}