import React, { useRef, useState } from "react";
//css
import "./TeamLeaderTable.css";
//Utils
import { formatHours,formatDate } from "../../../utils/formatHours.js";

const TeamLeaderTable = ({ data, handleCloseMoth }) => {
  const dialogRef = useRef(null);
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    try {
      setLoading(true);
      await handleCloseMoth();
      dialogRef.current.showModal();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="Leader-main">
      <div className="Leader-title">
        <h2>Registros de Horas Extras</h2>
        <button
          className="btn"
          onClick={handleApprove}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Aprovar Fechamento"}
        </button>

        <dialog ref={dialogRef}>
          <h2>Fechamento Realizado</h2>
          <h2>com Sucesso</h2>
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

          <tbody className="Leader-body">
            {data?.map((register) => {
              const totalHours = register.overtime_records.total_hours ?? 0;
              const nightHours = register.overtime_records.nigth_hours ?? 0;
              const dayHours = totalHours - nightHours;
              return (
                <tr key={register.overtime_records.id}>
                  <td>{register.users.name}</td>
                  <td>{formatDate(register.overtime_records.work_date)}</td>
                  <td>{formatHours(totalHours)}</td>
                  <td>{dayHours ? formatHours(dayHours) : "0"}</td>
                  <td>{nightHours ? formatHours(nightHours) : "0"}</td>
                  <td>
                    {register.overtime_records.overtime_type_id === 1
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