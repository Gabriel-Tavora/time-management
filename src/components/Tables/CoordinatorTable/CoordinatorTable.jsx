import React, { useCallback, useEffect, useRef, useState } from "react";
//css
import "../tables.css";
//Utils
import {
  formatHours,
  formatDate,
  formatTime,
} from "../../../utils/formatHours.js";
//components
import Button from "../../Layouts/Button/Button";
//hooks
import { useGroupUsers } from "../../../hooks/useFilterUserById.js";

const SUCCESS_DIALOG_TIMEOUT_MS = 4000;

const CoordinatorTable = ({ data, Approval, Rejected, disabled }) => {
  const confirmDialogRef = useRef(null);
  const successDialogRef = useRef(null);
  const successTimeoutRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState(null); // "approve" | "rejected" | null
  const [errorMessage, setErrorMessage] = useState(null);

  const { currentItem, currentEmployeePerformace, goNext, goPrev } =
    useGroupUsers(data);

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
    <div className="table-page table">
      <div>
        <h2 className="title-h2">Histórico de Horas Extras</h2>
        <ul className="menu-information">
          <li>
            <h1>Total de Horas Extras</h1>
            <h3 className="time">
              {formatHours(currentEmployeePerformace?.total_hours)}
            </h3>
          </li>
          <li>
            <h1>Total de Horas Noturnas</h1>
            <h3 className="night">
              {formatHours(currentEmployeePerformace?.nigth_hours)}
            </h3>
          </li>
          <li>
            <h1>Quantidade no Mês</h1>
            <h3>
              {currentEmployeePerformace?.total_overtimes_mouth > 0
                ? currentEmployeePerformace?.total_overtimes_mouth
                : "0"}
            </h3>
          </li>
        </ul>
      </div>

      <div className="table-page">
        <div className="table-header ">
          <div className="date-filter">
            <div className="table-header">
              <Button
                className="approved-btn"
                onClick={() => openDialog("approve")}
                disabled={disabled || loading}
                buttonText="Aprovar"
              />
              <Button
                className="rejected-btn"
                onClick={() => openDialog("rejected")}
                disabled={disabled || loading}
                buttonText="Rejeitar"
              />
            </div>
            <div className="table-header">
              <Button className="change-btn" onClick={goPrev} buttonText="◀" />
              <Button className="change-btn" onClick={goNext} buttonText="▶" />
            </div>
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
                onClick={closeSuccessDialog}
                buttonText="Fechar"
              />
            </dialog>
          </div>
        </div>

        <div className="table-container">
          <table className="app-table">
            <thead>
              <tr>
                <th>Colaboradores</th>
                <th>Data Inicial</th>
                <th>Data Final</th>
                <th>Horário Inicial</th>
                <th>Horário Final</th>
                <th>Horas Noturnas</th>
                <th>Horas Totais</th>
                <th>50%</th>
                <th>100%</th>
              </tr>
            </thead>

            <tbody>
              {!currentItem?.records?.length ? (
                <tr>
                  <td colSpan={9} className="empty-state">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                currentItem.records.map((record) => {
                  const totalHours = record.total_hours ?? 0;
                  const nightHours = record.nigth_hours ?? 0;
                  const startTime = record.start_time;
                  const endTime = record.end_time;
                  const type = record.hours_by_type ?? {};

                  return (
                    <tr key={record.id}>
                      <td>{currentItem.name}</td>
                      <td>{formatDate(startTime)}</td>
                      <td>{formatDate(endTime)}</td>
                      <td>{formatTime(startTime)}</td>
                      <td>{formatTime(endTime)}</td>
                      <td>{nightHours ? formatHours(nightHours) : "0"}</td>
                      <td>{formatHours(totalHours)}</td>
                      <td>
                        <span className="status pending">
                          {formatHours(type["1"] ?? 0)}
                        </span>
                      </td>
                      <td>
                        <span className="status approved">
                          {formatHours(type["2"] ?? 0)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorTable;
