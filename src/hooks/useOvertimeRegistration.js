import { useEffect, useRef, useState } from "react";

import { createOvertime, getUserHours } from "../services/overtimeData.js";
import { getCurrentDate } from "../utils/formatHours.js";

import {
  validateOvertime,
  combineDateTime,
  buildIsoDateTime,
  isDuplicate,
  hasTimeConflict,
} from "../validations/overtimeValidation.js";

import { Messages } from "../utils/message.js";

export function useOvertimeRegistration({ token, form, clearForm }) {
  const { endTime, endDate, startTime, startDate, jiraTask, observation } = form;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const submittingRef = useRef(false);
  const messageTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  const showMessage = (type, text) => {
    if (!isMountedRef.current) return;

    // Cancela o timeout da mensagem anterior antes de agendar um novo —
    // sem isso, uma mensagem antiga podia apagar uma mensagem nova.
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    setMessage({ type, text });

    messageTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setMessage(null);
      }
      messageTimeoutRef.current = null;
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setMessage(null);

    try {
      const { monthStart, monthEnd } = getCurrentDate();

      const validationError = validateOvertime({
        endTime,
        endDate,
        startTime,
        startDate,
        jiraTask,
        monthStart,
        monthEnd,
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

      const overtimeData = {
        work_date: startDate,
        start_time: buildIsoDateTime(startDate, startTime),
        end_time: buildIsoDateTime(endDate, endTime),
        jira_task_identifier: jiraTask.trim().toUpperCase(),
        observation,
      };

      await createOvertime(token, overtimeData);

      showMessage("success", Messages.SUCCESS);
      clearForm();
    } catch (err) {
      console.error(err);

      switch (err.status) {
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
          // erro desconhecido" genérico.
          showMessage("error", err.status === undefined ? Messages.NETWORK : Messages.UNKNOWN);
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
  };
}