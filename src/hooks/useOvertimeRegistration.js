import { useState } from "react";

import {
  createOvertime,
  getUserHours,
} from "../services/overtimeData.js";

import {
  validateOvertime,
  isDuplicate,
  hasTimeConflict,
} from "../validations/overtimeValidation.js";

import { formatDataSend } from "../utils/formatHours.js";
import { Messages } from "../utils/message.js";

export function useOvertimeRegistration({
  token,
  form,
  clearForm,
}) {
  const {
    workDate,
    startTime,
    endTime,
    jiraTask,
    observation,
  } = form;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const showMessage = (type, text) => {
    setMessage({ type, text });

    setTimeout(() => {
      setMessage(null);
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setMessage(null);

    const validationError = validateOvertime({
      workDate,
      startTime,
      endTime,
      jiraTask,
    });

    if (validationError) {
      showMessage("error", validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      const records = await getUserHours(token);

      if (records) {
        const dayRecords = records
          .map((record) => record.overtime_records)
          .filter(
            (record) => record.work_date?.slice(0, 10) === workDate
          );
        if (isDuplicate(dayRecords, startTime, endTime)) {
          showMessage("error", Messages.DUPLICATED);
          return;
        }

        if (hasTimeConflict(dayRecords, startTime, endTime)) {
          showMessage("error", Messages.OVERLAP);
          return;
        }
      }


      const overtimeData = {
        work_date: formatDataSend(workDate),
        start_time: formatDataSend(workDate, startTime),
        end_time: formatDataSend(workDate, endTime),
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
          showMessage("error", err.message);
          break;

        case 401:
          showMessage("error", Messages.SESSION);
          break;

        case 403:
          showMessage("error", Messages.FORBIDDEN);
          break;

        case 404:
          showMessage("error", "Recurso não encontrado.");
          break;

        case 409:
          showMessage("error", Messages.DUPLICATED);
          break;

        case 422:
          showMessage("error", err.message);
          break;

        case 500:
          showMessage("error", Messages.SERVER);
          break;

        default:
          showMessage("error", Messages.UNKNOWN);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    message,
    isSubmitting,
  };
}