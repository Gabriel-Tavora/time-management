import { Messages } from "../utils/message.js";

const MS_IN_HOUR = 1000 * 60 * 60;
const MS_IN_DAY = MS_IN_HOUR * 24;

export const FUTURE_TOLERANCE_HOURS = 0;
export const MAX_OVERTIME_SPAN_DAYS = 7;

const COMMERCIAL_START_HOUR = 8;
const COMMERCIAL_END_HOUR = 17;
const NIGHT_START_HOUR = 22;
const NIGHT_END_HOUR = 5;

export function buildIsoDateTime(date, time) {
  if (!date || !time) return null;
  return `${date}T${time}:00Z`;
}

export function combineDateTime(date, time) {
  const iso = buildIsoDateTime(date, time);
  return iso ? new Date(iso) : null;
}

function nowAsUtc() {
  return new Date();
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

function isWeekend(date) {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
}

function isCommercialHour(date) {
  const hour = date.getUTCHours();
  return hour >= COMMERCIAL_START_HOUR && hour < COMMERCIAL_END_HOUR;
}

function isHoliday(date, holidays = []) {
  const dateString = date.toISOString().slice(0, 10);
  return holidays.includes(dateString);
}

function hasCommercialHoursOnWorkday(start, end, holidays = []) {
  const cursor = new Date(start);
  cursor.setUTCHours(0, 0, 0, 0);

  const endDay = new Date(end);
  endDay.setUTCHours(0, 0, 0, 0);

  while (cursor <= endDay) {
    if (!isWeekend(cursor) && !isHoliday(cursor, holidays)) {
     
      const dayStart = new Date(cursor);
      dayStart.setUTCHours(COMMERCIAL_START_HOUR, 0, 0, 0);

      const dayEnd = new Date(cursor);
      dayEnd.setUTCHours(COMMERCIAL_END_HOUR, 0, 0, 0);

      if (start < dayEnd && end > dayStart) {
        return true;
      }
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return false;
}


export function validateOvertime({
  requireJira,
  endTime,
  endDate,
  startTime,
  startDate,
  jiraTask,
  monthStart,
  monthEnd,
  holidays = [],
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

  if (!start || !end) {
    return Messages.VALIDATION;
  }

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

  const now = nowAsUtc();
  const maxAllowedStart = new Date(
    now.getTime() + FUTURE_TOLERANCE_HOURS * MS_IN_HOUR,
  );

  if (start > maxAllowedStart) {
    return Messages.FUTURE_DATE;
  }

  if (!monthStart || !monthEnd) {
    return Messages.PERIOD_UNAVAILABLE;
  }

  const periodStart = normalizeToDate(monthStart, "00:00");
  const periodEnd = normalizeToDate(monthEnd, "23:59");

  if (
    !periodStart ||
    !periodEnd ||
    start < periodStart ||
    end > periodEnd
  ) {
    return Messages.OUTSIDE_PERIOD;
  }

  if (hasCommercialHoursOnWorkday(start, end, holidays)) {
    return Messages.INVALID_COMMERCIAL_HOURS;
  }

  const trimmedJira = jiraTask?.trim() ?? "";

  if (requireJira && !trimmedJira) {
    return Messages.REQUIRED_JIRA;
  }

  if (trimmedJira) {
    const normalizedJira = trimmedJira.toUpperCase();
    const jiraRegex = /^[A-Z]+-\d+$/;

    if (!jiraRegex.test(normalizedJira)) {
      return Messages.INVALID_JIRA;
    }
  }

  return null;
}

export function calculateNightHours(start, end) {
  let nightMs = 0;
  const cursor = new Date(start);

  while (cursor < end) {
    const hour = cursor.getUTCHours();
    const isNight = hour >= NIGHT_START_HOUR || hour < NIGHT_END_HOUR;

    // Próximo marco: próxima hora cheia ou fim do intervalo
    const nextHour = new Date(cursor);
    nextHour.setUTCMinutes(0, 0, 0);
    nextHour.setUTCHours(nextHour.getUTCHours() + 1);

    const next = new Date(Math.min(nextHour.getTime(), end.getTime()));
    const blockDuration = next.getTime() - cursor.getTime();

    if (isNight) {
      nightMs += blockDuration;
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