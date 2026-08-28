import React from "react";
import { FaEdit } from "react-icons/fa";

// Utils
import {
  formatHours,
  formatDate,
  formatTime,
} from "../../../utils/formatHours.js";

// Components
import Button from "../../common/Button/Button.jsx";

const Tablebody = ({
  data = [],
  isFilterActive = false,
  isViewingOwnRecords = false,
  editTime,
  handleEditTime,
  handleEditHours,
}) => {
  const showActions = isViewingOwnRecords;
  const colSpan = showActions ? 10 : 9;

  return (
    <div className="table-container">
      <table className="app-table">
        <thead>
          <tr>
            <th>Colaboradores</th>
            <th>Data Inicial</th>
            <th>Data Final</th>
            <th>Horário Inicial</th>
            <th>Horário Final</th>
            <th>Horas Noturnas</th>
            <th>Horas Totais</th>
            <th>50%</th>
            <th>100%</th>
            {showActions && (<th className="table-action-header"></th>)}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={colSpan} className="empty-state">
                {isFilterActive
                  ? "Nenhum registro encontrado no período selecionado."
                  : "Nenhum registro encontrado."}
              </td>
            </tr>
          ) : (
            data.map((register) => {
              const id = register.id;
              const totalHours = register.total_hours ?? 0;
              const nightHours = register.nigth_hours ?? 0;
              const startTime = register.start_time;
              const endTime = register.end_time;
              const type = register.hours_by_type ?? {};
              return (
                <tr
                  key={id}
                  onClick={
                    isViewingOwnRecords && handleEditTime
                      ? () => handleEditTime(id)
                      : undefined
                  }
                  className={
                    isViewingOwnRecords
                      ? "table-row--clickable"
                      : undefined
                  }
                >
                  <td>{register.employee_name}</td>
                  <td>{formatDate(startTime)}</td>
                  <td>{formatDate(endTime)}</td>
                  <td>{formatTime(startTime)}</td>
                  <td>{formatTime(endTime)}</td>
                  <td>{nightHours ? formatHours(nightHours) : "0"}</td>
                  <td>{formatHours(totalHours)}</td>
                  <td>
                    <span className="status pending">
                      {formatHours(type["1"] ?? 0)}
                    </span>
                  </td>
                  <td className={showActions ? "last-column" : undefined}>
                    <span className="status approved">
                      {formatHours(type["2"] ?? 0)}
                    </span>
                    {showActions && handleEditHours && (
                      <div className={`table-edit ${editTime === id ? "active" : ""}`}>
                        <Button
                          className="btn-table"
                          type="button"
                          icon={FaEdit}
                          aria-label="Editar hora extra"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleEditHours(
                              id,
                              "/EditHours"
                            );
                          }}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tablebody;