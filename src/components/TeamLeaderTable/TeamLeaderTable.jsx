import React from 'react'
//css
import "./TeamLeaderTable.css"
//Utils
import { formatHours } from "../../utils/formatHours.js"
//router-dom
import { useNavigate } from "react-router-dom";
const TeamLeaderTable = ({ data }) => {

  //navegação de páginas
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="Leader-main">
      <div className="Leader-title">
        <h2>Resumo dos Colaboradores</h2>

        <button onClick={() => handleNavigate("/RegisterHours")}>
          Aprovar
        </button>

      </div>
      <div className="Leader-table">
        <table className="Leader-stats">
          <thead>
            <tr className="main-register-stats-head-tr">
              <th>Colaborador</th>
              <th>Total de Horas Extras</th>
              <th>Total de Horas Noturnas</th>
              <th>type</th>
              <th>Aprovação</th>
            </tr>
          </thead>

          <tbody className="Leader-body">
            {data?.map((register) => (
              <tr key={register.overtime_records.id}>
                <td>{register.users.name}</td>
                <td>{formatHours(register.overtime_records.total_hours)}</td>
                <td>{formatHours(register.overtime_records.nigth_hours)}</td>
                <td>{register.overtime_records.overtime_type_id === 1 ? <p> 50%</p> : <p> 100%</p>}</td>
                <td>{register.overtime_records.overtime_type_id === 1 ?
                  <span className="status pending">
                    Pendente
                  </span> :
                  <span className="status approved">
                    Aprovado
                  </span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TeamLeaderTable