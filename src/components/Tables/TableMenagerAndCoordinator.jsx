import React from "react";
// css
import "../../styles/tables.css";
// Components
import Button from "../common/Button/Button.jsx";
import TableHeader from './TableHeader/TableHeader.jsx';
import Tablebody from './Tablebody/Tablebody';
// Hooks
import { useTableMenagerACoordinator } from "../../hooks/useMenagerAndCoordinator/useTableMenagerACoordinator";
import { useUsersMenagerACoordinator } from '../../hooks/useMenagerAndCoordinator/useUsersMenagerACoordinator';
const TableMenagerAndCoordinator = ({ data, idMonth, Approval, Rejected }) => {
  const {
    loading,
    handleOpenConfirm,
  } = useTableMenagerACoordinator({
    onApprove: Approval,
    onReject: Rejected,
  });

  const {
    tableData,
    total,
    currentEmployeePerformace,
    goNext,
    goPrev,
  } = useUsersMenagerACoordinator(
    data,
    idMonth
  );

  return (
    <div className="table-page table">

      <TableHeader
        data={currentEmployeePerformace}
        idExercice={idMonth}
      />

      <div className="table-page">
        <div className="table-header ">
          {data && (
            <div className="date-filter">
              <div className="table-header">
                <Button
                  className="approved-btn"
                  onClick={() => handleOpenConfirm("approve")}
                  disabled={loading}
                  buttonText={loading ? "Processando..." : "Aprovar"}
                />
                <Button
                  className="rejected-btn"
                  onClick={() => handleOpenConfirm("reject")}
                  disabled={loading}
                  buttonText={loading ? "Processando..." : "Rejeitar"}
                />
              </div>
              <div className="table-header">
                <Button className="change-btn" onClick={goPrev} buttonText="◀" />
                <Button className="change-btn" onClick={goNext} buttonText="▶" />
              </div>
            </div>
          )}
        </div>

        <Tablebody
          data={tableData}
        />
      </div>
    </div>
  );
};

export default TableMenagerAndCoordinator;
