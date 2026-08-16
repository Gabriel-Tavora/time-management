import React, { useState, useMemo } from "react";
// css
import "../tables.css";
import Swal from "sweetalert2";

// router-dom
import { useNavigate } from "react-router-dom";

// icons
import { FaPlus, FaTimes } from "react-icons/fa";

// Utils
import {
  formatHours,
  formatDate,
  formatTime,
} from "../../../utils/formatHours.js";

//hooks
import { useGroupUsers } from "../../../hooks/useFilterUserById.js";
import { useTeamLeaderTable } from "../../../hooks/useTeamLeaderTable";

//components
import Input from "../../Layouts/Inputs/Inputs.jsx";
import Button from "../../Layouts/Button/Button";

const TeamLeaderTable = ({ data, handleCloseMonth, idMonth }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
  };

  //filtrar users em tabelas com id
  const { currentItem, currentEmployeePerformace, goNext, goPrev } =
    useGroupUsers(data, idMonth);

  const isFilterActive = Boolean(startDate || endDate);

  const filteredRecords = useMemo(() => {
    const records = currentItem?.records ?? [];
    if (!isFilterActive) return records;

    return records.filter((record) => {
      const workDate = record?.work_date;
      if (!workDate) return false;

      const dateOnly = workDate.slice(0, 10);

      if (startDate && dateOnly < startDate) return false;
      if (endDate && dateOnly > endDate) return false;

      return true;
    });
  }, [currentItem, startDate, endDate, isFilterActive]);

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  const { loading, handleConfirmAction } = useTeamLeaderTable({
    onApprove: handleCloseMonth,
  });

  const handleOpenConfirm = async () => {
    const result = await Swal.fire({
      title: "Deseja aprovar o fechamento do mês?",
      text: "Após confirmar, o período será enviado para aprovação.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Aprovar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: {
        popup: "my-swal-popup",
        title: "my-swal-title",
        htmlContainer: "my-swal-text",
        confirmButton: "my-swal-confirm",
        cancelButton: "my-swal-cancel",
        icon: "my-swal-icon",
      },
    });

    if (result.isConfirmed) {
      await handleConfirmAction();
    }
  };
  return (
    <div className="table-page table">
      <div>
        <h2 className="title-h2">Histórico de Horas Extras</h2>
        <ul className="menu-information">
          <li>
            <h1>Total de Horas Extras</h1>
            <h3 className="time">
              {formatHours(currentEmployeePerformace?.total_hours)}
            </h3>
          </li>
          <li>
            <h1>Total de Horas Noturnas</h1>
            <h3 className="night">
              {formatHours(currentEmployeePerformace?.nigth_hours)}
            </h3>
          </li>
          <li>
            <h1>Quantidade no Mês</h1>
            <h3>
              {currentEmployeePerformace?.total_overtimes_mouth > 0
                ? currentEmployeePerformace.total_overtimes_mouth
                : "0"}
            </h3>
          </li>
        </ul>
      </div>

      <div className="table-page">
        <div className="table-header">
          <div className="date-filter">
            <div className="table-header">
              <Input
                className="btn"
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
                  className="btn btn-medium"
                  onClick={handleClearFilter}
                  aria-label="Limpar filtro de data"
                  icon={FaTimes}
                />
              )}
            </div>
            <div className="table-header">
              <Button
                className="btn"
                buttonText="Registrar Hora Extra"
                onClick={() => handleNavigate("/RegisterHours")}
                icon={FaPlus}
              />
              <Button
                className="btn-medium btn"
                buttonText={loading ? "Carregando..." : "Aprovar Fechamento"}
                onClick={handleOpenConfirm}
                disabled={loading}
              />
              <Button className="change-btn" onClick={goPrev} buttonText="◀" />
              <Button className="change-btn" onClick={goNext} buttonText="▶" />
            </div>
          </div>
        </div>

        <div className="table-container ">
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
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty-state">
                    {isFilterActive
                      ? "Nenhum registro encontrado no período selecionado."
                      : "Nenhum registro encontrado."}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((register) => {
                  const totalHours = register.total_hours ?? 0;
                  const nightHours = register.nigth_hours ?? 0;
                  const startTime = register.start_time;
                  const endTime = register.end_time;
                  const type = register.hours_by_type;
                  return (
                    <tr key={register.id}>
                      <td>{currentItem?.name}</td>
                      <td>{formatDate(startTime)}</td>
                      <td>{formatDate(endTime)}</td>
                      <td>{formatTime(startTime)}</td>
                      <td>{formatTime(endTime)}</td>
                      <td>{nightHours ? formatHours(nightHours) : "0"}</td>
                      <td>{formatHours(totalHours)}</td>
                      <td>
                        <span className="status pending">
                          {formatHours(type["1"])}
                        </span>
                      </td>
                      <td>
                        <span className="status approved">
                          {formatHours(type["2"])}
                        </span>
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

export default TeamLeaderTable;
