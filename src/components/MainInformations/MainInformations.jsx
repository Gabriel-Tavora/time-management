import React from "react";

//CSS
import { FaCalendarAlt, FaPlus } from "react-icons/fa";
import "./MainInformations.css";
const MainInformations = () => {
  return (
    <aside className="main-informations">
      <div className="main-header">
        <div className="main-header-title">
          <h1>Nome</h1>
          <p>Acompanhe suas Horas Extras.</p>
        </div>

        <div className="main-header-time">
          <h2>Abril/2024</h2>
          <FaCalendarAlt />
        </div>
      </div>

      <ul className="main-menu">
        <li>
          <p>Total de Horas Extras</p>
          <h2>32h 45m</h2>
          <p>No Mês</p>
        </li>

        <li>
          <p>Horas Noturnas</p>
          <h2>12h 35m</h2>
          <p>No Mês</p>
        </li>

        <li>
          <p>Média de Adicionaço</p>
          <h2>50%</h2>
          <p>No Mês</p>
        </li>

        <li>
          <p>Status do Fechamento</p>
          <h2>Pendente</h2>
          <p>aguardando aprovação</p>
        </li>
      </ul>

      <div className="main-register">
        <div className="main-register-title">
          <h2>Meus Registros de Horas Extras</h2>
          <button>
            <FaPlus />
            Registrar Hora Extra
          </button>
        </div>

        <table className="main-register-stats">
          <thead className="main-register-stats-head">
            <tr className="main-register-stats-head-tr">
              <th>Funcionário</th>
              <th>Data</th>
              <th>Horas Extras</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody className="main-register-stats-body">
            <tr>
              <td>João Silva</td>
              <td>26/06/2026</td>
              <td>2h 30min</td>
              <td>Aprovado</td>
            </tr>

            <tr>
              <td>Maria Souza</td>
              <td>25/06/2026</td>
              <td>1h 45min</td>
              <td>Pendente</td>
            </tr>

            <tr>
              <td>Carlos Lima</td>
              <td>24/06/2026</td>
              <td>3h 00min</td>
              <td>Recusado</td>
            </tr>
          </tbody>
        </table>
        <a href="">Ver Todos os Meus Registros</a>
      </div>
    </aside>
  );
};

export default MainInformations;
