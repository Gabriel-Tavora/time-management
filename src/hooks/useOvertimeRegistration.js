import { useEffect, useRef, useState, useCallback } from "react";

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
  const { endTime, endDate, startTime, startDate, jiraTask, observation } =
    form;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const submittingRef = useRef(false);
  const messageTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const showMessage = useCallback((type, text) => {
    if (!isMountedRef.current) return;

    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    setMessage({ type, text });

    messageTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setMessage(null);
      }
    }, 4000);
  }, []);

  const resetSubmitting = useCallback(() => {
    submittingRef.current = false;
    if (isMountedRef.current) {
      setIsSubmitting(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (submittingRef.current) return;
      submittingRef.current = true;
      setIsSubmitting(true);
      setMessage(null);

      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      try {
        const { monthStart, monthEnd } = getCurrentDate();

        const validationError = validateOvertime({
          requireJira: true,
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

        const records = await getUserHours(token, { signal });

        if (records && records.length > 0) {
          const allRecords = records
            .map((record) => record.overtime_records)
            .filter(Boolean);

          if (isDuplicate(allRecords, startDateTime, endDateTime)) {
            showMessage("error", Messages.DUPLICATED);
            return;
          }

          if (hasTimeConflict(allRecords, startDateTime, endDateTime)) {
            showMessage("error", Messages.OVERLAP);
            return;
          }
        }

        const overtimeData = {
          work_date: startDate,
          start_time: buildIsoDateTime(startDate, startTime),
          end_time: buildIsoDateTime(endDate, endTime),
          jira_task_identifier: jiraTask.trim().toUpperCase(),
        };

        if (observation && String(observation).trim() !== "") {
          overtimeData.observation = String(observation).trim();
        }

        await createOvertime(token, overtimeData, { signal });

        showMessage("success", Messages.SUCCESS);
        clearForm();
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error(err);

        const status =
          err.status ??
          err.response?.status ??
          (err.message?.includes("401") ? 401 : undefined) ??
          (err.message?.includes("403") ? 403 : undefined) ??
          (err.message?.includes("404") ? 404 : undefined) ??
          (err.message?.includes("409") ? 409 : undefined) ??
          (err.message?.includes("422") ? 422 : undefined) ??
          (err.message?.includes("429") ? 429 : undefined) ??
          (err.message?.includes("500") ? 500 : undefined);

        switch (status) {
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
              status === undefined ? Messages.NETWORK : Messages.UNKNOWN,
            );
        }
      } finally {
        resetSubmitting();
        abortControllerRef.current = null;
      }
    },
    [
      endTime,
      endDate,
      startTime,
      startDate,
      jiraTask,
      observation,
      token,
      clearForm,
      showMessage,
      resetSubmitting,
    ],
  );

  return {
    handleSubmit,
    message,
    isSubmitting,
  };
}