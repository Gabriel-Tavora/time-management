import React, { useCallback, useEffect, useRef, useState } from "react";
//css
import "./CoordinatorTable.css";
import "../tables.css";
//Utils
import { formatHours, formatDate } from "../../../utils/formatHours.js";
//components
import Input from "../../Layouts/Inputs/Inputs.jsx";
import Button from "../../Layouts/Button/Button";
//hooks
import { useGroupUsers } from "../../../hooks/useFilterUserById.js";
const OVERTIME_TYPE_NORMAL = 1;
const SUCCESS_DIALOG_TIMEOUT_MS = 4000;

const CoordinatorTable = ({ data, Approval, Rejected, disabled }) => {
  const confirmDialogRef = useRef(null);
  const successDialogRef = useRef(null);
  const successTimeoutRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState(null); // "approve" | "rejected" | null
  const [errorMessage, setErrorMessage] = useState(null);
  const {
    items,
    currentItem,
    currentIndex,
    total,
    hasNext,
    hasPrev,
    goNext,
    goPrev,
    goToIndex,
  } = useGroupUsers(data);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const dialog = confirmDialogRef.current;
    if (!dialog) return;

    const handleNativeClose = () => {
      setDialogMode(null);
      setErrorMessage(null);
    };

    dialog.addEventListener("close", handleNativeClose);
    return () => dialog.removeEventListener("close", handleNativeClose);
  }, []);

  useEffect(() => {
    const dialog = successDialogRef.current;
    if (!dialog) return;

    const handleNativeClose = () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
        successTimeoutRef.current = null;
      }
    };

    dialog.addEventListener("close", handleNativeClose);
    return () => dialog.removeEventListener("close", handleNativeClose);
  }, []);

  const openDialog = useCallback((mode) => {
    setDialogMode(mode);
    setErrorMessage(null);
    confirmDialogRef.current?.showModal();
  }, []);

  const closeDialog = useCallback(() => {
    confirmDialogRef.current?.close();
  }, []);

  const closeSuccessDialog = useCallback(() => {
    successDialogRef.current?.close();
  }, []);

  const handleConfirmAction = useCallback(async () => {
    if (!dialogMode || loading) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      if (dialogMode === "approve") {
        await Approval();
      } else {
        await Rejected();
      }

      confirmDialogRef.current?.close();
      successDialogRef.current?.showModal();

      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = setTimeout(() => {
        successDialogRef.current?.close();
      }, SUCCESS_DIALOG_TIMEOUT_MS);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        dialogMode === "approve"
          ? "Erro ao aprovar. Tente novamente."
          : "Erro ao rejeitar. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }, [dialogMode, loading, Approval, Rejected]);

  return (
    <div className="table-page">
      <div>
        <h2 className="title-h2">Histórico de Horas Extras</h2>
        <ul className="menu-information">
          <li>
            <h1>Total de Horas Extras</h1>
            <h3 className="time">{formatHours(currentItem?.total_hours)}</h3>
          </li>
          <li>
            <h1>Total de Horas Noturnas</h1>
            <h3 className="night">{formatHours(currentItem?.nigth_hours)}</h3>
          </li>
          <li>
            <h1>Quantidade no Mês</h1>
            <h3>
              {currentItem?.total_overtimes_mouth > 0
                ? currentItem.total_overtimes_mouth
                : "0"}
            </h3>
          </li>
        </ul>
      </div>

      <div className="table-page">
        <div className="table-header ">
          <div className="date-filter">
            <Button className="change-btn" onClick={goPrev} buttonText="◀" />
            <div className="dialog-actions">
              <Button
                className="rejected-btn"
                onClick={() => openDialog("rejected")}
                disabled={disabled || loading}
                buttonText="Rejeitar"
              />
              <Button
                className="approved-btn"
                onClick={() => openDialog("approve")}
                disabled={disabled || loading}
                buttonText="Aprovar"
              />
            </div>
            <Button className="change-btn" onClick={goNext} buttonText="▶" />

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
                <Button
                  className="btn"
                  onClick={closeDialog}
                  disabled={loading}
                  buttonText="Cancelar"
                />
                <Button
                  className="btn"
                  onClick={handleConfirmAction}
                  disabled={loading}
                  buttonText={
                    loading
                      ? "Processando..."
                      : dialogMode === "approve"
                        ? "Aprovar"
                        : "Rejeitar"
                  }
                />
              </div>
            </dialog>

            {/* Dialog de sucesso */}
            <dialog
              ref={successDialogRef}
              aria-labelledby="success-dialog-title"
            >
              <h2 id="success-dialog-title">Operação realizada com sucesso!</h2>
              <Button
                className="btn"
                className="btn"
                onClick={closeSuccessDialog}
                buttonText="Fechar"
              />
            </dialog>
          </div>
        </div>

        <div className="table-container Coordinator-table">
          <table className="app-table Coordinator-stats">
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
              {data?.map((register) => {
                const record = register.overtime_record;
                const totalHours = record?.total_hours ?? 0;
                const nightHours = record?.nigth_hours ?? 0;
                const dayHours = Math.max(totalHours - nightHours, 0);

                return (
                  <tr key={record?.id}>
                    <td>{register.users?.name}</td>
                    <td>
                      {record?.work_date ? formatDate(record.work_date) : "-"}
                    </td>
                    <td>{formatHours(totalHours)}</td>
                    <td>{dayHours ? formatHours(dayHours) : "0"}</td>
                    <td>{nightHours ? formatHours(nightHours) : "0"}</td>
                    <td>
                      {record?.overtime_type_id === OVERTIME_TYPE_NORMAL ? (
                        <span className="status pending">50%</span>
                      ) : (
                        <span className="status approved">100%</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorTable;
