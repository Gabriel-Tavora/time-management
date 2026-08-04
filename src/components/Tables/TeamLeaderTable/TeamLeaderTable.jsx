import React, { useRef, useState,useMemo } from "react";
//css
import "./TeamLeaderTable.css";
import "../tables.css";
//Utils
import { formatHours, formatDate } from "../../../utils/formatHours.js";
import { getOvertimeSummary } from "../../../utils/overtimeSummary.js";

const TeamLeaderTable = ({ data, handleCloseMonth }) => {
  const dialogRef = useRef(null);
  const dialogAlert = useRef(null)
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    setLoading(true);
    dialogAlert.current?.close();
    
    try {
      await handleCloseMonth();
      dialogRef.current?.showModal();
      setTimeout(() => {
        dialogRef.current?.close();
      }, 4000);

    } catch (error) {
      console.error(error);
      alert("Erro ao fechar o mês. Tente novamente.");

    } finally {
      setLoading(false);
    }
  }
  const closeDialog = () => {
    dialogAlert.current?.close();
  };

  const summary = useMemo(() => getOvertimeSummary(data), [data]);

  return (
    <div>
      <ul className="menu-information">
        <li>
          <h1>Total de Horas Extras</h1>
          <h3 className="time">{formatHours(summary.totalHours)}</h3>
        </li>
        <li>
          <h1>Total de Horas Noturnas</h1>
          <h3 className="night">{formatHours(summary.totalNightHours)}</h3>
        </li>
        <li>
          <h1>Status do Fechamento</h1>
          {data ? (
            <h3 className="status pending">Pending</h3>
          ) : (
            <h3 className="status approved">Approved</h3>
          )}
        </li>
      </ul>
      
      <div className="table-page Leader-main">
        <div className="table-header Leader-title">
          <h2>Registros de Horas Extras do Mês</h2>
          <button
            className="btn"
            onClick={() => dialogAlert.current?.showModal()}
            disabled={loading}
          >
            {loading ? "Carregando..." : "Aprovar Fechamento"}
          </button>

          <dialog ref={dialogAlert} className="close-dialog">
            <h2>Deseja aprovar o fechamento do mês?</h2>
            <p>Após confirmar, o período será enviado para aprovação.</p>
            <div className="dialog-actions">
              <button onClick={closeDialog} className="dialog-cancel-btn">
                Cancelar
              </button>
              <button onClick={handleApprove} className="dialog-confirm-btn">
                Aprovar
              </button>
            </div>
          </dialog>

          <dialog ref={dialogRef}>
            <h2>Fechamento realizado com sucesso!</h2>
            <button onClick={() => dialogRef.current.close()}>
              Fechar
            </button>
          </dialog>
        </div>

        <div className="table-container Leader-table">
          <table className="app-table Leader-stats">
            <thead>
              <tr>
                <th>Colaboradores</th>
                <th>Data</th>
                <th>Horas Totais</th>
                <th>Horas Diurnas</th>
                <th>Horas Noturnas</th>
                <th>Tipo</th>
              </tr>
            </thead>

            <tbody >
              {data?.map((register) => {
                const record = register.overtime_records;
                const totalHours = record?.total_hours ?? 0;
                const nightHours = record?.nigth_hours ?? 0;
                const dayHours = Math.max(totalHours - nightHours, 0);

                return (
                  <tr key={record?.id}>
                    <td>{register.users?.name}</td>
                    <td>{record?.work_date ? formatDate(record.work_date) : "-"}</td>
                    <td>{formatHours(totalHours)}</td>
                    <td>{dayHours > 0 ? formatHours(dayHours) : "00:00"}</td>
                    <td>{nightHours > 0 ? formatHours(nightHours) : "00:00"}</td>
                    <td>
                      {record?.overtime_type_id === 1
                        ? <span className="status pending">50%</span>
                        : <span className="status approved">100%</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div></div>
  );
};

export default TeamLeaderTable;