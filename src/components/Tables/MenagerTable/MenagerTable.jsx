import React, { useCallback, useEffect, useRef, useState } from "react";
//css
import "./MenagerTable.css";
import "../tables.css";
//Utils
import { formatHours, formatDate } from "../../../utils/formatHours.js";

// 1 = hora extra normal (50%); qualquer outro valor = hora extra em feriado/domingo (100%)
const OVERTIME_TYPE_NORMAL = 1;
const SUCCESS_DIALOG_TIMEOUT_MS = 4000;

function getRowData(register) {
  const record = register?.overtime_record;
  const totalHours = record?.total_hours ?? 0;
  const nightHours = record?.nigth_hours ?? 0;
  const dayHours = Math.max(totalHours - nightHours, 0);
  return { record, totalHours, nightHours, dayHours };
}

const MenagerTable = ({
  data,
  onApprove = async () => {},
  onReject = async () => {},
  disabled,
}) => {
  const confirmDialogRef = useRef(null);
  const successDialogRef = useRef(null);
  const successTimeoutRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState(null); // "approve" | "rejected" | null
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, []);

  const openDialog = useCallback((mode) => {
    setDialogMode(mode);
    setErrorMessage(null);
    confirmDialogRef.current?.showModal();
  }, []);

  const closeDialog = useCallback(() => {
    confirmDialogRef.current?.close();
    setDialogMode(null);
    setErrorMessage(null);
  }, []);

  const closeSuccessDialog = useCallback(() => {
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    successDialogRef.current?.close();
  }, []);

  const handleConfirmAction = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      if (dialogMode === "approve") {
        await onApprove();
      } else {
        await onReject();
      }

      confirmDialogRef.current?.close();
      setDialogMode(null);
      successDialogRef.current?.showModal();
      successTimeoutRef.current = setTimeout(() => {
        successDialogRef.current?.close();
      }, SUCCESS_DIALOG_TIMEOUT_MS);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        dialogMode === "approve"
          ? "Erro ao aprovar. Tente novamente."
          : "Erro ao rejeitar. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }, [dialogMode, onApprove, onReject]);

  return (
    <div className="table-page Manager-main">
      <div className="table-header Manager-title">
        <h2>Resumo dos Colaboradores</h2>

        <div>
          <button
            type="button"
            className="rejected-btn"
            onClick={() => openDialog("rejected")}
            disabled={disabled || loading}
          >
            Rejeitar
          </button>
          <button
            type="button"
            className="approved-btn"
            onClick={() => openDialog("approve")}
            disabled={disabled || loading}
          >
            Aprovar
          </button>

          <dialog ref={confirmDialogRef} className="close-dialog">
            <h2>
              {dialogMode === "approve"
                ? "Deseja aprovar o fechamento do mês?"
                : "Deseja rejeitar o fechamento?"}
            </h2>
            <p>
              {dialogMode === "approve"
                ? "Após confirmar, o período será encerrado"
                : "Os dados serão devolvidos para correção"}
            </p>

            {errorMessage && (
              <p className="form-message error">{errorMessage}</p>
            )}

            <div className="dialog-actions">
              <button type="button" onClick={closeDialog} disabled={loading}>
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={loading}
              >
                {loading
                  ? "Processando..."
                  : dialogMode === "approve"
                  ? "Aprovar"
                  : "Rejeitar"}
              </button>
            </div>
          </dialog>

          {/* Dialog de sucesso */}
          <dialog ref={successDialogRef}>
            <h2>Operação realizada com sucesso!</h2>
            <button type="button" onClick={closeSuccessDialog}>
              Fechar
            </button>
          </dialog>
        </div>
      </div>

      <div className="table-container Manager-table">
        <table className="app-table Manager-stats">
          <thead>
            <tr>
              <th>Colaborador</th>
              <th>Data</th>
              <th>Total de Horas Extras</th>
              <th>Horas Diurnas</th>
              <th>Horas Noturnas</th>
              <th>Tipo</th>
            </tr>
          </thead>

          <tbody>
            {!data || data.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              data.map((register, index) => {
                const { record, totalHours, nightHours, dayHours } =
                  getRowData(register);

                return (
                  <tr key={register?.id ?? record?.id ?? index}>
                    <td>{register.users?.name}</td>
                    <td>
                      {record?.work_date ? formatDate(record.work_date) : "-"}
                    </td>
                    <td>{formatHours(totalHours)}</td>
                    <td>{formatHours(dayHours)}</td>
                    <td>{formatHours(nightHours)}</td>
                    <td>
                      {record ? (
                        record.overtime_type_id === OVERTIME_TYPE_NORMAL ? (
                          <span className="status pending">50%</span>
                        ) : (
                          <span className="status approved">100%</span>
                        )
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenagerTable;