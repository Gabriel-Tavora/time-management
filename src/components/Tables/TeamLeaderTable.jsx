import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
// css
import "../../styles/tables.css";
import Swal from "sweetalert2";

// router-dom
import { useNavigate } from "react-router-dom";

// icons
import { FaPlus, FaTimes, FaEdit } from "react-icons/fa";

// Utils
import {
  formatHours,
  formatDate,
  formatTime,
} from "../../utils/formatHours.js";

// hooks
import { useTeamLeaderUsers } from "../../hooks/useTeamLeader/useTeamLeaderUsers.js";
import { useTeamLeaderTable } from "../../hooks/useTeamLeader/useTeamLeaderTable.js";

// context
import { useAuthValue } from "../../context/TokenContext.jsx";

// components
import Input from "../Layouts/Inputs/Inputs.jsx";
import Button from "../Layouts/Button/Button";

const TeamLeaderTable = ({ data, handleCloseMonth, idMonth }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editTime, setEditTime] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const editTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  const navigate = useNavigate();

  const { id: currentUserId } = useAuthValue();

  const processedData = useMemo(() => {
    return data?.map((item) => ({ ...item })) || [];
  }, [data, refreshKey]);

  const { currentItem, currentEmployeePerformace, goNext, goPrev } =
    useTeamLeaderUsers(processedData, idMonth);

  const isViewingOwnRecords =
    currentUserId != null &&
    currentItem?.id != null &&
    String(currentItem.id) === String(currentUserId);

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

  // Cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (editTimeoutRef.current) {
        clearTimeout(editTimeoutRef.current);
      }
    };
  }, []);

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate],
  );

  const handleClearFilter = useCallback(() => {
    setStartDate("");
    setEndDate("");
  }, []);

  const handleEditHours = useCallback(
    (overtimeId, path) => {
      const record = filteredRecords.find((item) => item.id === overtimeId);

      if (!record) {
        console.warn("Hora extra não encontrada");
        return;
      }

      navigate(path, { state: { overtime: record } });
    },
    [filteredRecords, navigate],
  );

  const { loading, handleConfirmAction } = useTeamLeaderTable({
    onApprove: handleCloseMonth,
  });

  const handleOpenConfirm = useCallback(async () => {
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
      try {
        await handleConfirmAction();
        if (isMountedRef.current) {
          setRefreshKey((k) => k + 1);
        }
      } catch (err) {
        console.error("Erro ao aprovar mês:", err);
      }
    }
  }, [handleConfirmAction]);

  const handleEditTime = useCallback((registerId) => {
    if (editTimeoutRef.current) {
      clearTimeout(editTimeoutRef.current);
    }

    setEditTime(registerId);

    editTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setEditTime(null);
      }
      editTimeoutRef.current = null;
    }, 5000);
  }, []);

  const colSpan = isViewingOwnRecords ? 10 : 9;

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
            {data && (
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
                  name="endDate"
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
            )}
            <div className="table-header">
              <Button
                className="btn"
                buttonText="Registrar Hora Extra"
                onClick={() => handleNavigate("/RegisterHours")}
                icon={FaPlus}
              />
              {data && (
                <>
                  <Button
                    className="btn-medium btn"
                    buttonText={loading ? "Carregando..." : "Aprovar Fechamento"}
                    onClick={handleOpenConfirm}
                    disabled={loading}
                  />
                  <Button className="change-btn" onClick={goPrev} buttonText="◀" />
                  <Button className="change-btn" onClick={goNext} buttonText="▶" /></>
              )}
            </div>
          </div>
        </div>

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
                {isViewingOwnRecords && (
                  <th className="table-action-header"></th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={colSpan} className="empty-state">
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
                  const type = register.hours_by_type ?? {};

                  return (
                    <tr
                      key={register.id}
                      onClick={
                        isViewingOwnRecords
                          ? () => handleEditTime(register.id)
                          : undefined
                      }
                      className={
                        isViewingOwnRecords ? "table-row--clickable" : undefined
                      }
                    >
                      <td>{currentItem?.name}</td>
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
                      <td
                        className={
                          isViewingOwnRecords ? "last-column" : undefined
                        }
                      >
                        <span className="status approved">
                          {formatHours(type["2"] ?? 0)}
                        </span>

                        {isViewingOwnRecords && (
                          <div
                            className={`table-edit ${editTime === register.id ? "active" : ""
                              }`}
                          >
                            <Button
                              className="btn-table"
                              type="button"
                              icon={FaEdit}
                              aria-label="Editar hora extra"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditHours(register.id, "/EditHours");
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
      </div>
    </div>
  );
};

export default TeamLeaderTable;