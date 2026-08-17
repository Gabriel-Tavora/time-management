import { useEffect, useRef, useState } from "react";

import {
  getUserHours,
  editOvertime,
} from "../services/overtimeData.js";

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

export function useOvertimeEdit({
  token,
  form,
  overtime,
  clearForm,
}) {
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

    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    setMessage({
      type,
      text,
    });

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
      /*
       * Verifica ID
       */
      if (!overtimeId) {
        showMessage(
          "error",
          "Não foi possível identificar a hora extra."
        );

        return;
      }

      /*
       * Validação
       *
       * type 2 = edição.
       * Jira não é obrigatório.
       */
      const { monthStart, monthEnd } = getCurrentDate();

      const type = 2;

      const validationError = validateOvertime({
        type,
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

      /*
       * Combina data + horário
       */
      const startDateTime = combineDateTime(
        startDate,
        startTime
      );

      const endDateTime = combineDateTime(
        endDate,
        endTime
      );

      /*
       * Busca registros existentes
       */
      const records = await getUserHours(token);

      if (records) {
        const relevantRecords = records
          .map((record) => record.overtime_records)
          .filter(Boolean)
          .filter(
            (record) =>
              String(record.id) !== String(overtimeId)
          )
          .filter((record) => {
            const workDate =
              record.work_date?.slice(0, 10);

            return (
              workDate === startDate ||
              workDate === endDate
            );
          });

        /*
         * Verifica duplicidade
         */
        if (
          isDuplicate(
            relevantRecords,
            startDateTime,
            endDateTime
          )
        ) {
          showMessage(
            "error",
            Messages.DUPLICATED
          );

          return;
        }

        /*
         * Verifica conflito
         */
        if (
          hasTimeConflict(
            relevantRecords,
            startDateTime,
            endDateTime
          )
        ) {
          showMessage(
            "error",
            Messages.OVERLAP
          );

          return;
        }
      }

      /*
       * ==================================================
       * VALORES ORIGINAIS
       * ==================================================
       */

      const originalStartTime =
        formatTimeForInput(
          overtime.start_time
        );

      const originalEndTime =
        formatTimeForInput(
          overtime.end_time
        );

      const originalStartDate =
        formatDateForInput(
          overtime.start_time
        );

      const originalEndDate =
        formatDateForInput(
          overtime.end_time
        );

      const originalJira =
        overtime.jira_task_identifier || "";

      const originalObservation =
        overtime.observation || "";

      /*
       * ==================================================
       * PAYLOAD SOMENTE COM CAMPOS ALTERADOS
       * ==================================================
       */

      const overtimeData = {};

      /*
       * Data inicial
       */
      if (startDate !== originalStartDate) {
        overtimeData.work_date = startDate;
      }

      /*
       * Horário inicial
       */
      if (
        startDate !== originalStartDate ||
        startTime !== originalStartTime
      ) {
        overtimeData.start_time =
          buildIsoDateTime(
            startDate,
            startTime
          );
      }

      /*
       * Horário final
       *
       * A data também é comparada porque horário
       * noturno pode mudar o dia.
       */
      if (
        endDate !== originalEndDate ||
        endTime !== originalEndTime
      ) {
        overtimeData.end_time =
          buildIsoDateTime(
            endDate,
            endTime
          );
      }

      /*
       * Jira
       */
      const currentJira =
        jiraTask?.trim() || "";

      if (currentJira !== originalJira) {
        overtimeData.jira_task_identifier =
          currentJira
            ? currentJira.toUpperCase()
            : "";
      }

      /*
       * Observação
       */
      const currentObservation =
        observation?.trim() || "";

      if (
        currentObservation !==
        originalObservation
      ) {
        overtimeData.observation =
          currentObservation;
      }

      /*
       * ==================================================
       * NADA FOI ALTERADO
       * ==================================================
       */

      if (Object.keys(overtimeData).length === 0) {
        showMessage(
          "error",
          "Nenhuma alteração foi realizada."
        );

        return;
      }

      console.log(
        "PATCH /overtime/",
        overtimeId
      );

      console.log(
        "Dados alterados:",
        overtimeData
      );

      /*
       * PATCH
       */
      await editOvertime(
        token,
        overtimeId,
        overtimeData
      );

      showMessage(
        "success",
        "Hora extra editada com sucesso."
      );

      if (clearForm) {
        clearForm();
      }

    } catch (err) {
      console.error(err);

      switch (err?.status) {
        case 400:
        case 422:
          showMessage(
            "error",
            err.message ||
              Messages.VALIDATION
          );
          break;

        case 401:
          showMessage(
            "error",
            Messages.SESSION
          );
          break;

        case 403:
          showMessage(
            "error",
            Messages.FORBIDDEN
          );
          break;

        case 404:
          showMessage(
            "error",
            Messages.NOT_FOUND
          );
          break;

        case 409:
          showMessage(
            "error",
            Messages.DUPLICATED
          );
          break;

        case 429:
          showMessage(
            "error",
            Messages.RATE_LIMITED
          );
          break;

        case 500:
          showMessage(
            "error",
            Messages.SERVER
          );
          break;

        default:
          showMessage(
            "error",
            err?.status === undefined
              ? Messages.NETWORK
              : Messages.UNKNOWN
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
  };
}