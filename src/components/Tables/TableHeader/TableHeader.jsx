import React from 'react'
//components
import OncallTable from "../Oncall/OncallTable.jsx"
//utils
import { formatHours } from "../../../utils/formatHours.js"

const TableHeader = ({ data, idExercice }) => {

  return (
    <div>
      <h2 className="title-h2">Histórico de Horas Extras</h2>
      <ul className="menu-information">
        <li>
          <h1>Total de Horas Extras</h1>
          <h3 className="time">
            {formatHours(data?.total_hours ?? 0)}
          </h3>
        </li>
        <li>
          <h1>Total de Horas Noturnas</h1>
          <h3 className="night">
            {formatHours(data?.nigth_hours ?? 0)}
          </h3>
        </li>
        <li>
          <h1>Quantidade no Mês</h1>
          <h3>
            {data?.total_overtimes_mouth > 0
              ? data?.total_overtimes_mouth
              : "0"}
          </h3>
        </li>
        {idExercice && (
          <OncallTable
            idMonth={idExercice}
          />
        )}
      </ul>
    </div>
  )
}

export default TableHeader;