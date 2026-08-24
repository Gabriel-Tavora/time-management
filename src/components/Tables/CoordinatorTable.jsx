import React from "react";
import Swal from "sweetalert2";
//css
import "../../styles/tables.css";
//Utils
import {
  formatHours,
  formatDate,
  formatTime,
} from "../../utils/formatHours.js";
//components
import Button from "../Layouts/Button/Button.jsx";
//hooks
import { useCoordinatorTable } from "../../hooks/useCoordinator/useCoordinatorTable.js";
import { useCoordinatorUsers } from '../../hooks/useCoordinator/useCoordinatorUsers';

const CoordinatorTable = ({
  data,
  idMonth,
  Approval,
  Rejected,
}) => {

  const {
    currentUser,
    total,
    currentEmployeePerformace,
    goNext,
    goPrev,
  } = useCoordinatorUsers(
    data,
    idMonth
  );

  const {
    loading,
    handleConfirmAction,
  } = useCoordinatorTable({
    onApprove: Approval,
    onReject: Rejected,
  });
  const handleOpenConfirm = async (mode) => {
    const isApprove = mode === "approve";

    const result = await Swal.fire({
      title: isApprove
        ? "Deseja aprovar o fechamento do mês?"
        : "Deseja rejeitar o fechamento?",

      text: isApprove
        ? "Após confirmar, o período será encerrado."
        : "Os dados serão devolvidos para correção.",

      icon: isApprove ? "warning" : "question",
      showCancelButton: true,
      confirmButtonText: isApprove
        ? "Aprovar"
        : "Rejeitar",

      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: {
        popup: "my-swal-popup",
        title: "my-swal-title",
        htmlContainer: "my-swal-text",
        confirmButton: "my-swal-confirm",
        cancelButton: "my-swal-cancel",
        icon: "my-swal-icon",
      },
    });

    if (result.isConfirmed) {
      await handleConfirmAction(mode);
    }
  };
  return (
    <div className="table-page table">
      <div>
        <h2 className="title-h2">Histórico de Horas Extras</h2>
        <ul className="menu-information">
          <li>
            <h1>Total de Horas Extras</h1>
            <h3 className="time">
              {formatHours(currentEmployeePerformace?.total_hours ?? 0)}
            </h3>
          </li>
          <li>
            <h1>Total de Horas Noturnas</h1>
            <h3 className="night">
              {formatHours(currentEmployeePerformace?.nigth_hours ?? 0)}
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
          {data && (
            <div className="date-filter">
              <div className="table-header">
                <Button
                  className="approved-btn"
                  onClick={() => handleOpenConfirm("approve")}
                  buttonText={loading ? "Processando..." : "Aprovar"}
                />
                <Button
                  className="rejected-btn"
                  onClick={() => handleOpenConfirm("reject")}
                  buttonText={loading ? "Processando..." : "Rejeitar"}
                />
              </div>
              <div className="table-header">
                <Button className="change-btn" onClick={goPrev} buttonText="◀" />
                <Button className="change-btn" onClick={goNext} buttonText="▶" />
              </div>
            </div>
          )}
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
              {!currentUser?.records?.length ? (
                <tr>
                  <td colSpan={9} className="empty-state">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                currentUser.records.map((records) => {
                  const totalHours = records.total_hours ?? 0;
                  const nightHours = records.nigth_hours ?? 0;
                  const startTime = records.start_time;
                  const endTime = records.end_time;
                  const type = records.hours_by_type ?? {};
                  return (
                    <tr key={records.id}>
                      <td>{currentUser.name}</td>
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
