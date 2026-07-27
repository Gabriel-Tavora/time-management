import { Messages } from "../utils/message.js";

export function validateOvertime({ workDate, startTime, endTime, jiraTask }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!workDate) {
    return Messages.REQUIRED_DATE;
  }

  const selectedDate = new Date(workDate);

  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate > today) {
    return Messages.FUTURE_DATE;
  }

  if (!startTime) {
    return Messages.REQUIRED_START;
  }

  if (!endTime) {
    return Messages.REQUIRED_END;
  }

  if (endTime <= startTime) {
    return Messages.INVALID_TIME;
  }

  if (!jiraTask.trim()) {
    return Messages.REQUIRED_JIRA;
  }

  const jiraRegex = /^[A-Z]+-\d+$/;

  if (!jiraRegex.test(jiraTask.trim())) {
    return Messages.INVALID_JIRA;
  }

  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);

  const totalHours = (end.getTime() - start.getTime()) / 1000 / 60 / 60;

  if (totalHours > 12) {
    return Messages.MAX_HOURS;
  }

  return null;
}

export function getTimeOnly(dateTime) {
  return dateTime?.slice(11, 16);
}

export function isDuplicate(records, startTime, endTime) {
  return records.some(
    (record) =>
      getTimeOnly(record.start_time) === startTime &&
      getTimeOnly(record.end_time) === endTime
  );
}

export function hasTimeConflict(records, startTime, endTime) {
  return records.some((record) => {
    const recordStart = getTimeOnly(record.start_time);
    const recordEnd = getTimeOnly(record.end_time);

    return startTime < recordEnd && endTime > recordStart;
  });
}