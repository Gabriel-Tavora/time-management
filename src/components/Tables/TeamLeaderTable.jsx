import React, { useState, useMemo, useCallback } from "react";
// css
import "../../styles/tables.css";
// router-dom
import { useNavigate } from "react-router-dom";
// icons
import { FaPlus, FaTimes } from "react-icons/fa";
// hooks
import { useTeamLeaderUsers } from "../../hooks/useTeamLeader/useTeamLeaderUsers.js";
import { useTeamLeaderTable } from "../../hooks/useTeamLeader/useTeamLeaderTable.js";
import { useEditTimeout } from "../../hooks/useOvertimeAndTimout/useEditTimeout";
// context
import { useAuthValue } from "../../context/TokenContext.jsx";

// components
import Input from "../common/Inputs/Inputs.jsx";
import Button from "../common/Button/Button.jsx";
import TableHeader from './TableHeader/TableHeader.jsx';
import Tablebody from './Tablebody/Tablebody.jsx';

const TeamLeaderTable = ({ data, handleCloseMonth, idMonth }) => {
  const navigate = useNavigate();
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

  const { id: currentUserId } = useAuthValue();
  const {
    editTime,
    containerRef,
    handleEditTime,
  } = useEditTimeout();

  const processedData = useMemo(() => { return data?.map((item) => ({ ...item })) || []; }, [data]);

  const {
    currentItem,
    currentEmployeePerformace,
    goNext,
    goPrev } =
    useTeamLeaderUsers(
      processedData,
      idMonth
    );

  const isViewingOwnRecords =
    currentUserId != null &&
    currentItem?.id != null &&
    String(currentItem.id) === String(currentUserId);

  const colSpan = isViewingOwnRecords ? 10 : 9;

  //filtro 

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const isFilterActive = Boolean(startDate || endDate);

  const filteredRecords = useMemo(() => {
    const records = currentItem?.records ?? [];

    if (!isFilterActive) return records;

    return records.filter((record) => {
      const dateOnly = record?.work_date?.slice(0, 10);

      if (!dateOnly) return false;
      if (startDate && dateOnly < startDate) return false;
      if (endDate && dateOnly > endDate) return false;

      return true;
    });
  }, [currentItem, startDate, endDate, isFilterActive]);

  const handleEditHours = useCallback((overtimeId, path) => {
    const record = filteredRecords.find((item) => item.id === overtimeId);

    if (!record) {
      console.warn("Hora extra não encontrada");
      return;
    }

    navigate(path, { state: { overtime: record } });
  },
    [filteredRecords, navigate],
  );

  const {
    loading,
    handleOpenConfirm }
    = useTeamLeaderTable({
      onApprove: handleCloseMonth,
    });

  const tableData = filteredRecords.map((register) => ({
    id: register.id,
    start_time: register.start_time,
    end_time: register.end_time,
    total_hours: register.total_hours,
    nigth_hours: register.nigth_hours,
    hours_by_type: register.hours_by_type,
    employee_name: currentItem?.name ?? "",
  }));

  return (
    <div className="table-page table" ref={containerRef}>
      <TableHeader
        data={currentEmployeePerformace}
      />

      <div className="table-page">
        <div className="table-header">
          <div className="date-filter">
            {data?.length > 0 && (
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
        <div className="indicatorBar"></div>
        <Tablebody
          data={tableData}
          isFilterActive={isFilterActive}
          isViewingOwnRecords={isViewingOwnRecords}
          editTime={editTime}
          handleEditTime={handleEditTime}
          handleEditHours={handleEditHours}
        />
      </div>
    </div>
  );
};

export default TeamLeaderTable;