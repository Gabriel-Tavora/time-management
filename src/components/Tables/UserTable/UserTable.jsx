import React, { useMemo } from "react";
//css
import "./UserTable.css";
import "../tables.css";
import { FaPlus } from "react-icons/fa";
//Utils
import { formatHours, formatDate } from "../../../utils/formatHours.js";
import { getOvertimeSummary } from "../../../utils/overtimeSummary.js";
//router-dom
import { useNavigate } from "react-router-dom";

const UserTable = ({ data, closureStatus, monthPerf }) => {
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
  };

  const summary = useMemo(() => getOvertimeSummary(data), [data]);
  return (
    <>
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
            <h3 className="status pending">Pendente</h3>
          ) : (
            <h3 className="status approved">Aprovado</h3>
          )}
        </li>
      </ul>

      <div className="table-page main-register">
        <div className="table-header main-register-title">
          <h2>Registros de Horas Extras</h2>
          <button onClick={() => handleNavigate("/RegisterHours")}>
            <FaPlus />
            Registrar Hora Extra
          </button>
        </div>

        <div className="table-container">
          <table className="app-table main-register-stats">
            <thead>
              <tr>
                <th>Data</th>
                <th>Horas Totais</th>
                <th>Horas Diurnas</th>
                <th>Horas Noturnas</th>
                <th>Tipo</th>
              </tr>
            </thead>

            <tbody>
              {data?.map((register) => {
                const totalHours = register.overtime_records.total_hours ?? 0;
                const nightHours = register.overtime_records.nigth_hours ?? 0;
                const dayHours = totalHours - nightHours;
                return (
                  <tr key={register.overtime_records.id}>
                    <td>{formatDate(register.overtime_records.work_date)}</td>
                    <td>{formatHours(totalHours)}</td>
                    <td>{dayHours ? formatHours(dayHours) : "0"}</td>
                    <td>{nightHours ? formatHours(nightHours) : "0"}</td>
                    <td>
                      {register.overtime_records.overtime_type_id === 1 ? (
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
    </>
  );
};

export default UserTable;
