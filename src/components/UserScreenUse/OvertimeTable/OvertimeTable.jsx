import React from 'react'
//css
import "./OvertimeTable.css"
import { FaPlus } from "react-icons/fa";
//Utils
import { formatHours, formatDate } from "../../../utils/formatHours.js"
//router-dom
import { useNavigate } from "react-router-dom";
const OvertimeTable = ({ data }) => {

  //navegação de páginas
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="main-register">
      <div className="main-register-title">
        <h2>Meus Registros de Horas Extras</h2>

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
              <th>Total de Horas Extras</th>
              <th>Total de Horas Noturnas</th>
              <th>Tipo</th>
            </tr>
          </thead>

          <tbody className="main-register-stats-body">
            {data.map((register) => (
              <tr key={register.overtime_records.id}>
                <td>{formatDate(register.overtime_records.work_date)}</td>
                <td>{formatHours(register.overtime_records.total_hours)}</td>
                <td>{formatHours(register.overtime_records.nigth_hours)}</td>
                <td>{register.overtime_records.overtime_type_id === 1 ? <p> 50%</p> : <p> 100%</p>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OvertimeTable;