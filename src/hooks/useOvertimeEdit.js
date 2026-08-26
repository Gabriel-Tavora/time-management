import { useEffect, useRef, useState, useCallback } from "react";

//services
import { getUserHours, editOvertime } from "../services/overtimeData.js";

//validations
import {
  validateOvertime,
  combineDateTime,
  buildIsoDateTime,
  isDuplicate,
  hasTimeConflict,
} from "../validations/overtimeValidation.js";

//utils
import {
  formatTimeForInput,
  formatDateForInput,
} from "../utils/editFormatTime.js";
import { getCurrentDate } from "../utils/formatHours.js";
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
  const abortControllerRef = useRef(null);
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
    }, MESSAGE_DURATION_MS);
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

      if (submittingRef.current || isRedirecting) return;

      submittingRef.current = true;
      setIsSubmitting(true);
      setMessage(null);

      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

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
          requireJira: true,
        });

        if (validationError) {
          showMessage("error", validationError);
          return;
        }

        const startDateTime = combineDateTime(startDate, startTime);
        const endDateTime = combineDateTime(endDate, endTime);

        const records = await getUserHours(token, { signal });

        if (records && records.length > 0) {
          const otherRecords = records
            .map((record) => record.overtime_records)
            .filter(Boolean)
            .filter((record) => String(record.id) !== String(overtimeId));

          if (isDuplicate(otherRecords, startDateTime, endDateTime)) {
            showMessage("error", Messages.DUPLICATED);
            return;
          }

          if (hasTimeConflict(otherRecords, startDateTime, endDateTime)) {
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

        if (
          startDate !== originalStartDate ||
          startTime !== originalStartTime
        ) {
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

        await editOvertime(token, overtimeId, overtimeData, { signal });
        showMessage("success", Messages.EDIT_SUCCESS);

        if (isMountedRef.current) {
          setIsRedirecting(true);
        }

        successTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current && onSuccess) {
            onSuccess();
          }
        }, MESSAGE_DURATION_MS);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error(err);

        const status =
          err?.status ??
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
      overtimeId,
      overtime,
      token,
      onSuccess,
      isRedirecting,
      showMessage,
      resetSubmitting,
    ],
  );

  return {
    handleSubmit,
    message,
    isSubmitting,
    isRedirecting,
  };
}