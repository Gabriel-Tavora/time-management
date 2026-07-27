import React from 'react'
//css
import "./UserTable.css"
import { FaPlus } from "react-icons/fa";
//Utils
import { formatHours, formatDate } from "../../../utils/formatHours.js"
//router-dom
import { useNavigate } from "react-router-dom";
const UserTable = ({ data }) => {

  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
  };
  console.log(data);
  return (
    <div className="main-register">
      <div className="main-register-title">
        <h2>Registros de Horas Extras</h2>

        <button onClick={() => handleNavigate("/RegisterHours")}>
          <FaPlus />
          Registrar Hora Extra
        </button>

      </div>
      <div className="table-container">
        <table className="main-register-stats">
          <thead className="main-register-stats-head">
            <tr className="main-register-stats-head-tr">
              <th>Data</th>
              <th>Horas Totais</th>
              <th>Horas Diurnas</th>
              <th>Horas Noturnas</th>
              <th>Tipo</th>
            </tr>
          </thead>

          <tbody className="main-register-stats-body">
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
                    {register.overtime_records.overtime_type_id === 1
                      ? "50%"
                      : "100%"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserTable;