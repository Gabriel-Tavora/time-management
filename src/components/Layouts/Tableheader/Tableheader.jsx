import React from 'react'

const Tableheader = () => {
  return (
    <div>
      <h2 className="title-h2">Histórico de Horas Extras</h2>
      <ul className="menu-information">
        <li>
          <h1>Total de Horas Extras</h1>
          <h3 className="time">
            {formatHours(currentEmployeePerformace?.total_hours ?? 0)}
          </h3>
        </li>
        <li>
          <h1>Total de Horas Noturnas</h1>
          <h3 className="night">
            {formatHours(currentEmployeePerformace?.nigth_hours ?? 0)}
          </h3>
        </li>
        <li>
          <h1>Quantidade no Mês</h1>
          <h3>
            {currentEmployeePerformace?.total_overtimes_mouth > 0
              ? currentEmployeePerformace?.total_overtimes_mouth
              : "0"}
          </h3>
        </li>
        <OncallTable
          idMonth={idExercice}
        />
      </ul>
    </div>
  )
}

export default Tableheader