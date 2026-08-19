import { useEffect, useRef, useState } from "react";

import { getUserHours, editOvertime } from "../services/overtimeData.js";

import { getCurrentDate } from "../utils/formatHours.js";

import {
  validateOvertime,
  combineDateTime,
  buildIsoDateTime,
  isDuplicate,
  hasTimeConflict,
} from "../validations/overtimeValidation.js";

import {
  formatTimeForInput,
  formatDateForInput,
} from "../utils/editFormatTime.js";

import { Messages } from "../utils/message.js";

const MESSAGE_DURATION_MS = 4000;

export function useOvertimeEdit({ token, form, overtime, onSuccess }) {
  const {
    overtimeId,
    endTime,
    endDate,
    startTime,
    startDate,
    jiraTask,
    observation,
  } = form;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [message, setMessage] = useState(null);

  const submittingRef = useRef(false);
  const messageTimeoutRef = useRef(null);
  const successTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;

      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const showMessage = (type, text) => {
    if (!isMountedRef.current) return;

    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    setMessage({ type, text });

    messageTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setMessage(null);
      }
      messageTimeoutRef.current = null;
    }, MESSAGE_DURATION_MS);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submittingRef.current || isRedirecting) return;

    submittingRef.current = true;
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (!overtimeId) {
        showMessage("error", Messages.MISSING_OVERTIME_ID);
        return;
      }

      const { monthStart, monthEnd } = getCurrentDate();

      const validationError = validateOvertime({
        endTime,
        endDate,
        startTime,
        startDate,
        jiraTask,
        monthStart,
        monthEnd,
        requireJira: false,
      });

      if (validationError) {
        showMessage("error", validationError);
        return;
      }

      const startDateTime = combineDateTime(startDate, startTime);
      const endDateTime = combineDateTime(endDate, endTime);
      const records = await getUserHours(token);

      if (records) {
        const relevantRecords = records
          .map((record) => record.overtime_records)
          .filter(Boolean)
          .filter((record) => String(record.id) !== String(overtimeId))
          .filter((record) => {
            const workDate = record.work_date?.slice(0, 10);
            return workDate === startDate || workDate === endDate;
          });

        if (isDuplicate(relevantRecords, startDateTime, endDateTime)) {
          showMessage("error", Messages.DUPLICATED);
          return;
        }

        if (hasTimeConflict(relevantRecords, startDateTime, endDateTime)) {
          showMessage("error", Messages.OVERLAP);
          return;
        }
      }

      const originalStartTime = formatTimeForInput(overtime.start_time);
      const originalEndTime = formatTimeForInput(overtime.end_time);
      const originalStartDate = formatDateForInput(overtime.start_time);
      const originalEndDate = formatDateForInput(overtime.end_time);
      const originalJira = overtime.jira_task_identifier || "";
      const originalObservation = overtime.observation || "";

      const overtimeData = {};

      if (startDate !== originalStartDate) {
        overtimeData.work_date = startDate;
      }

      if (startDate !== originalStartDate || startTime !== originalStartTime) {
        overtimeData.start_time = buildIsoDateTime(startDate, startTime);
      }

      if (endDate !== originalEndDate || endTime !== originalEndTime) {
        overtimeData.end_time = buildIsoDateTime(endDate, endTime);
      }

      const currentJira = jiraTask?.trim() || "";
      if (currentJira !== originalJira) {
        overtimeData.jira_task_identifier = currentJira
          ? currentJira.toUpperCase()
          : "";
      }

      const currentObservation = observation?.trim() || "";
      if (currentObservation !== originalObservation) {
        overtimeData.observation = currentObservation;
      }

      if (Object.keys(overtimeData).length === 0) {
        showMessage("error", Messages.NO_CHANGES);
        return;
      }

      await editOvertime(token, overtimeId, overtimeData);
      showMessage("success", Messages.EDIT_SUCCESS);

      if (isMountedRef.current) {
        setIsRedirecting(true);
      }

      successTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current && onSuccess) {
          onSuccess();
        }
        successTimeoutRef.current = null;
      }, MESSAGE_DURATION_MS);
    } catch (err) {
      console.error(err);

      switch (err?.status) {
        case 400:
        case 422:
          showMessage("error", err.message || Messages.VALIDATION);
          break;

        case 401:
          showMessage("error", Messages.SESSION);
          break;

        case 403:
          showMessage("error", Messages.FORBIDDEN);
          break;

        case 404:
          showMessage("error", Messages.NOT_FOUND);
          break;

        case 409:
          showMessage("error", Messages.DUPLICATED);
          break;

        case 429:
          showMessage("error", Messages.RATE_LIMITED);
          break;

        case 500:
          showMessage("error", Messages.SERVER);
          break;

        default:
          showMessage(
            "error",
            err?.status === undefined ? Messages.NETWORK : Messages.UNKNOWN,
          );
      }
    } finally {
      submittingRef.current = false;

      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  return {
    handleSubmit,
    message,
    isSubmitting,
    isRedirecting,
  };
}