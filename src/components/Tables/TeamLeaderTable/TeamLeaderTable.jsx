import React, { useRef, useState } from "react";
//css
import "./TeamLeaderTable.css";
import "../tables.css";
//Utils
import { formatHours, formatDate } from "../../../utils/formatHours.js";

const TeamLeaderTable = ({ data, handleCloseMoth }) => {
  const dialogRef = useRef(null);
  const dialogAlert = useRef(null)
  const [loading, setLoading] = useState(false);

  async function handleApprove() {

    setLoading(true);
    dialogAlert.current?.close();

    try {
      await handleCloseMoth();
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
  return (
    <div className="Leader-main">
      <div className="Leader-title">
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

      <div className="Leader-table">
        <table className="Leader-stats">
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
    </div>
  );
};

export default TeamLeaderTable;