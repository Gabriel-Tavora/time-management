import React, { useMemo, useState } from "react";
//css
import "./UserTable.css";
import "../tables.css";
import { FaPlus, FaTimes } from "react-icons/fa";
//Utils
import { formatHours, formatDate } from "../../../utils/formatHours.js";
import { getOvertimeSummary } from "../../../utils/overtimeSummary.js";
//router-dom
import { useNavigate } from "react-router-dom";
//hooks
import Input from "../../Layouts/Inputs/Inputs.jsx";
import Button from '../../Layouts/Button/Button';

const UserTable = ({ data, closureStatus, monthPerf, token }) => {
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const isFilterActive = Boolean(startDate || endDate);

  const filteredData = useMemo(() => {
    if (!data) return data;
    if (!isFilterActive) return data;

    return data.filter((register) => {
      const workDate = register.overtime_records?.work_date;
      if (!workDate) return false;

      const dateOnly = workDate.slice(0, 10);

      if (startDate && dateOnly < startDate) return false;
      if (endDate && dateOnly > endDate) return false;

      return true;
    });
  }, [data, startDate, endDate, isFilterActive]);

  const summary = useMemo(
    () => getOvertimeSummary(filteredData),
    [filteredData]
  );

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="user-register">
      <div>
        <h2 className="title-h2">Histórico de Horas Extras</h2>

        <ul className="menu-information">
          <li>
            <h1>Total de Horas Extras</h1>
            <h3 className="time">{formatHours(monthPerf.total_hours)}</h3>
          </li>
          <li>
            <h1>Total de Horas Noturnas</h1>
            <h3 className="night">{formatHours(monthPerf.nigth_hours)}</h3>
          </li>
          <li>
            <h1>Quantidade no Mês</h1>
            <h3>
              {monthPerf?.total_overtimes_mouth > 0
                ? monthPerf.total_overtimes_mouth
                : "0"}
            </h3>
          </li>
        </ul>
      </div>
      <div className="table-page">
        <div className="table-header user-title">
          <div className="date-filter">
            <Input
              classNameIn="filter-start-date"
              labelText="Data Inicial"
              id="filter-start-date"
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => setStartDate(e.target.value)}
              name="startDate"
            />
            <Input
              classNameIn="filter-start-date"
              labelText="Data Final"
              id="filter-end-date"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              name="startDate"
            />

            {isFilterActive && (
              <Button
                buttonText="Limpar"
                className="clear-filter-btn"
                onClick={handleClearFilter}
                aria-label="Limpar filtro de data"
                icon={FaTimes}
              />

            )}
            <Button
              classNameIn="register-btn"
              buttonText="Registrar Hora Extra"
              className="register-btn"
              onClick={() => handleNavigate("/RegisterHours")}
              aria-label="Limpar filtro de data"
              icon={FaPlus}
            />
          </div>

        </div>

        <div className="table-container">
          <table className="app-table">
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
              {filteredData && filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-state">
                    {isFilterActive
                      ? "Nenhum registro encontrado no período selecionado."
                      : "Nenhum registro encontrado."}
                  </td>
                </tr>
              ) : (
                filteredData?.map((register) => {
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserTable;