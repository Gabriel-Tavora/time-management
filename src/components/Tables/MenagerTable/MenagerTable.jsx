import React from "react";
// css
import "./MenagerTable.css";
import "../tables.css";
// Utils
import { formatHours, formatDate } from "../../../utils/formatHours.js";
import { getRowData } from "../../../utils/tableHelpers";
// Hook
import { useMenagerTable } from "../../../hooks/useMenagerTable";
//services
const OVERTIME_TYPE_NORMAL = 1;

const MenagerTable = ({ 
  data,
  onApprove = async () => { },
  onReject = async () => { },
  disabled
}) => {
  const {
    confirmDialogRef,
    successDialogRef,
    loading,
    dialogMode,
    errorMessage,
    openDialog,
    closeDialog,
    closeSuccessDialog,
    handleConfirmAction,
  } = useMenagerTable({ onApprove, onReject });

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

          <dialog
            ref={confirmDialogRef}
            className="close-dialog"
            aria-labelledby="confirm-dialog-title"
          >
            <h2 id="confirm-dialog-title">
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
              <p className="form-message error" role="alert">
                {errorMessage}
              </p>
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

          <dialog ref={successDialogRef} aria-labelledby="success-dialog-title">
            <h2 id="success-dialog-title">Operação realizada com sucesso!</h2>
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