import Swal from "sweetalert2";

// css
import "../../styles/tables.css";

// Utils
import {
  formatHours,
  formatDate,
  formatTime,
} from "../../utils/formatHours.js";

// Hook
import { useMenagerTable } from "../../hooks/useMenager/useMenagerTable.js";
import { useCoordinatorUsers } from '../../hooks/useCoordinator/useCoordinatorUsers';
// Components
import Button from "../Layouts/Button/Button.jsx";

const MenagerTable = ({ data, onApprove, onReject, idMonth }) => {
  const {
    loading,
    handleConfirmAction,
  } = useMenagerTable({
    onApprove,
    onReject,
  });

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
  const records = currentUser?.records ?? [];

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
                ? currentEmployeePerformace.total_overtimes_mouth
                : "0"}
            </h3>
          </li>
        </ul>
      </div>

      <div className="table-page">
        <div className="table-header">
          {data && (
            <div className="date-filter">

              <div className="table-header">
                <Button
                  className="approved-btn"
                  onClick={() => handleOpenConfirm("approve")}
                  disabled={loading}
                  buttonText={loading ? "Processando..." : "Aprovar"}
                />

                <Button
                  className="rejected-btn"
                  onClick={() => handleOpenConfirm("reject")}
                  disabled={loading}
                  buttonText={loading ? "Processando..." : "Rejeitar"}
                />
              </div>

              <div className="table-header">
                <Button
                  className="change-btn"
                  onClick={goPrev}
                  buttonText="◀"
                />

                <Button
                  className="change-btn"
                  onClick={goNext}
                  buttonText="▶"
                />
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
              {records.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty-state">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                records.map((record) => {
                  const totalHours = record.total_hours ?? 0;
                  const nightHours = record.nigth_hours ?? 0;
                  const startTime = record.start_time;
                  const endTime = record.end_time;
                  const type = record.hours_by_type ?? {};

                  return (
                    <tr key={record.id}>
                      <td>{currentUser?.name}</td>
                      <td>{formatDate(startTime)}</td>
                      <td>{formatDate(endTime)}</td>
                      <td>{formatTime(startTime)}</td>
                      <td>{formatTime(endTime)}</td>
                      <td>
                        {nightHours
                          ? formatHours(nightHours)
                          : "0"}
                      </td>
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

export default MenagerTable;