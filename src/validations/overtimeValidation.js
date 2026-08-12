import { Messages } from "../utils/message.js";

const MS_IN_HOUR = 1000 * 60 * 60;
const MS_IN_DAY = MS_IN_HOUR * 24;

export function buildIsoDateTime(date, time) {
  if (!date || !time) return null;
  return `${date}T${time}:00Z`;
}

export function combineDateTime(date, time) {
  const iso = buildIsoDateTime(date, time);
  return iso ? new Date(iso) : null;
}

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function validateOvertime({
  endTime,
  endDate,
  startTime,
  startDate,
  jiraTask,
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

  const todayUtc = combineDateTime(localDateString(), "00:00");
  const startDateUtc = combineDateTime(startDate, "00:00");
  const endDateUtc = combineDateTime(endDate, "00:00");

  if (startDateUtc > todayUtc) {
    return Messages.FUTURE_DATE;
  }

  const dayDiff = (endDateUtc - startDateUtc) / MS_IN_DAY;

  if (dayDiff < 0) {
    return Messages.INVALID_DATE_ORDER;
  }

  if (dayDiff > 1) {
    return Messages.INVALID_DATE_RANGE;
  }

  const start = combineDateTime(startDate, startTime);
  const end = combineDateTime(endDate, endTime);

  if (end <= start) {
    return Messages.INVALID_TIME;
  }

  const totalHours = (end - start) / MS_IN_HOUR;

  if (totalHours > 12) {
    return Messages.MAX_HOURS;
  }

  if (!jiraTask.trim()) {
    return Messages.REQUIRED_JIRA;
  }

  const jiraRegex = /^[A-Z]+-\d+$/;

  if (!jiraRegex.test(jiraTask.trim())) {
    return Messages.INVALID_JIRA;
  }

  return null;
}

export function calculateNightHours(start, end) {
  let nightMs = 0;
  const cursor = new Date(start);

  while (cursor < end) {
    const next = new Date(Math.min(cursor.getTime() + MS_IN_HOUR, end.getTime()));
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