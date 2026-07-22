import React from "react";
//css
import "./CoordinatorTable.css";
//Utils
import { formatHours } from "../../utils/formatHours.js";
const CoordinatorTable = ({ data, Approval, Rejected }) => {
  return (
    <div className="Coordinator-main">
      <div className="Coordinator-title">
        <h2>Resumo dos Colaboradores</h2>

        <div>
          <button className="approved-btn" onClick={Approval}>
            Aprovar
          </button>
          <button className="rejected-btn" onClick={Rejected}>
            Rejeitar
          </button>
        </div>
      </div>
      <div className="Coordinator-table">
        <table className="Coordinator-stats">
          <thead>
            <tr>
              <th>Colaborador</th>
              <th>Total de Horas Extras</th>
              <th>Total de Horas Noturnas</th>
             
            </tr>
          </thead>

          <tbody className="Coordinator-body">
            {data
              ?.filter(
                (register) => register.overtime_records.overtime_type_id != 1,
              )
              .map((register) => (
                <tr key={register.overtime_records.id}>
                  <td>{register.users.name}</td>
                  <td>{formatHours(register.overtime_records.total_hours)}</td>
                  <td>{formatHours(register.overtime_records.nigth_hours)}</td>
                  
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoordinatorTable;
