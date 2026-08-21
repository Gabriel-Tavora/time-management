import React, { useMemo, useState, useRef } from "react";
//css
import "../../styles/tables.css";
import { FaPlus, FaTimes, FaEdit } from "react-icons/fa";
//Utils
import { formatHours, formatDate, formatTime } from "../../utils/formatHours.js";
//router-dom
import { useNavigate } from "react-router-dom";
//hooks
import Input from "../Layouts/Inputs/Inputs.jsx";
import Button from '../Layouts/Button/Button.jsx';

const UserTable = ({ data, closureStatus, monthPerf, token }) => {

  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
  };

  const timeout = useRef(null);
  const [editTime, setEditTime] = useState(null);

  const handleEditTime = (register) => {
    setEditTime(register);

    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      setEditTime(null);
    }, 5000);
  };

  const handleEditHours = (editTime, path) => {
    const record = filteredData?.find(
      (item) => item.overtime_records.id === editTime
    );

    if (!record) {
      console.log("Hora extra não encontrada");
      return;
    }

    navigate(path, {
      state: {
        overtime: record.overtime_records,
      },
    });
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const isFilterActive = Boolean(startDate || endDate);

  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

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

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
  };
  return (
    <div className="table-page table ">
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
      <div className="table-page content">
        <div className="table-header">
          <div className="date-filter">
            <div className="table-header">
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
                  className="btn-medium btn"
                  onClick={handleClearFilter}
                  icon={FaTimes}
                />

              )}
            </div>
            <Button
              buttonText="Registrar Hora Extra"
              className="btn-medium btn"
              onClick={() => handleNavigate("/RegisterHours")}
              icon={FaPlus}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="app-table">
            <thead>
              <tr>
                <th>Data Inicial</th>
                <th>Data Final</th>
                <th>Horário Inicial</th>
                <th>Horário Final</th>
                <th>Horas Noturnas</th>
                <th>Horas Totais</th>
                <th>50%</th>
                <th>100%</th>
                <th className="table-action-header"></th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty-state">
                    {isFilterActive
                      ? "Nenhum registro encontrado no período selecionado."
                      : "Nenhum registro encontrado."}
                  </td>
                </tr>
              ) : (
                filteredData.map((register) => {
                  const overtime = register.overtime_records;
                  const startTime = overtime.start_time;
                  const endTime = overtime.end_time;
                  const totalHours = overtime.total_hours ?? 0;
                  const nightHours = overtime.nigth_hours ?? 0;
                  const type = register.hours_by_type ?? {};

                  return (
                    <tr
                      key={overtime.id}
                      onClick={() => handleEditTime(overtime.id)}
                    >
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
                      <td className="last-column">
                        <span className="status approved">
                          {formatHours(type["2"] ?? 0)}
                        </span>
                        <div
                          className={`table-edit ${editTime === overtime.id ? "active" : ""}`}>
                          <Button
                            className="btn-table"
                            type="button"
                            icon={FaEdit}
                            aria-label="Editar hora extra"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditHours(
                                overtime.id,
                                "/EditHours"
                              );
                            }}
                          />
                        </div>
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