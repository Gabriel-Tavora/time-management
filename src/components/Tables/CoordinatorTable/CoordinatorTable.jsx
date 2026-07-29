import React from "react";
//css
import "./CoordinatorTable.css";
//Utils
import { formatHours } from "../../../utils/formatHours.js";
import { formatDate } from "../../../utils/formatHours.js"; // ajuste o caminho se formatDate estiver em outro arquivo

const CoordinatorTable = ({ data, Approval, Rejected, disabled }) => {
  return (
    <div className="Coordinator-main">
      <div className="Coordinator-title">
        <h2>Resumo dos Colaboradores</h2>

        <div>
          <button className="rejected-btn" onClick={Rejected} disabled={disabled}>
            Rejeitar
          </button>
          <button className="approved-btn" onClick={Approval} disabled={disabled}>
            Aprovar
          </button>
        </div>
      </div>
      <div className="Coordinator-table">
        <table className="Coordinator-stats">
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

          <tbody className="Coordinator-body">
            {data?.map((register) => {
              const record = register.overtime_record;

              const totalHours = record?.total_hours ?? 0;
              const nightHours = record?.nigth_hours ?? 0;
              const dayHours = Math.max(totalHours - nightHours, 0);

              return (
                <tr key={record?.id}>
                  <td>{register.users?.name}</td>
                  <td>{record?.work_date ? formatDate(record.work_date) : "-"}</td>
                  <td>{formatHours(totalHours)}</td>
                  <td>{dayHours ? formatHours(dayHours) : "0"}</td>
                  <td>{nightHours ? formatHours(nightHours) : "0"}</td>
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

export default CoordinatorTable;