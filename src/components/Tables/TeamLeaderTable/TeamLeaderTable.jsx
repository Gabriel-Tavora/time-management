import React, { useRef, useState, useMemo } from "react";
// css
import "./TeamLeaderTable.css";
import "../tables.css";
// router-dom
import { useNavigate } from "react-router-dom";
// icons
import { FaPlus, FaTimes } from "react-icons/fa";
// Utils
import { formatHours, formatDate } from "../../../utils/formatHours.js";
//hooks
import { useGroupUsers } from "../../../hooks/useFilterUserById.js";
import { useRegisterHours } from "../../../hooks/useRegisterHours.js";
//components
import Input from "../../Layouts/Inputs/Inputs.jsx";
import Button from '../../Layouts/Button/Button';

const TeamLeaderTable = ({ data, handleCloseMonth, monthPerf }) => {
  const navigate = useNavigate();
  const successDialogRef = useRef(null);
  const confirmDialogRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  //filtrar users em tabelas com id
  const {
    items,
    currentItem,
    currentIndex,
    total,
    hasNext,
    hasPrev,
    goNext,
    goPrev,
    goToIndex,
  } = useGroupUsers(data);

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

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  async function handleApprove() {
    setLoading(true);
    confirmDialogRef.current?.close();

    try {
      await handleCloseMonth();
      successDialogRef.current?.showModal();
      setTimeout(() => {
        successDialogRef.current?.close();
      }, 4000);
    } catch (error) {
      console.error(error);
      alert("Erro ao fechar o mês. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const closeDialog = () => {
    confirmDialogRef.current?.close();
  };

  return (
    <div className="table">
      
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
        <div className="table-header Leader-title">
          <div className="date-filter">
            <Button
              className="change-btn"
              onClick={goPrev}
              buttonText="◀"
            />
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
                className="btn"
                onClick={handleClearFilter}
                aria-label="Limpar filtro de data"
                icon={FaTimes}
              />
            )}

            <Button
              className="btn"
              buttonText="Registrar Hora Extra"
              onClick={() => handleNavigate("/RegisterHours")}
              aria-label="Limpar filtro de data"
              icon={FaPlus}
            />
            <Button
              className="btn"
              buttonText={loading ? "Carregando..." : "Aprovar Fechamento"}
              onClick={() => confirmDialogRef.current?.showModal()}
              disabled={loading}
              aria-label="Limpar filtro de data"
            />
            <Button
              className="change-btn"
              onClick={goNext}
              buttonText="▶"
            />
          </div>

          <dialog ref={confirmDialogRef} className="close-dialog">
            <h2>Deseja aprovar o fechamento do mês?</h2>
            <p>Após confirmar, o período será enviado para aprovação.</p>
            <div className="dialog-actions">
              <Button
                className="btn"
                onClick={closeDialog}
                buttonText="Cancelar"
              />
              <Button
                onClick={handleApprove}
                className="btn"
                buttonText="Aprovar"
              />
            </div>
          </dialog>

          <dialog ref={successDialogRef}>
            <h2>Fechamento realizado com sucesso!</h2>
            <Button
              className="btn"
              onClick={() => successDialogRef.current?.close()}
              buttonText="Fechar"
            />
          </dialog>
        </div>

        <div className="table-container Leader-table">
          <table className="app-table Leader-stats">
            <thead>
              <tr>
                <th>Colaboradores</th>
                <th>Data</th>
                <th>Horas Totais</th>
                <th>Horas Diurnas</th>
                <th>Horas Noturnas</th>
                <th>Tipo</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    {isFilterActive
                      ? "Nenhum registro encontrado no período selecionado."
                      : "Nenhum registro encontrado."}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const totalHours = record?.total_hours ?? 0;
                  const nightHours = record?.nigth_hours ?? 0;
                  const dayHours = Math.max(totalHours - nightHours, 0);

                  return (
                    <tr key={record.id}>
                      <td>{currentItem?.name}</td>
                      <td>
                        {record?.work_date ? formatDate(record.work_date) : "-"}
                      </td>
                      <td>{formatHours(totalHours)}</td>
                      <td>{dayHours > 0 ? formatHours(dayHours) : "00:00"}</td>
                      <td>
                        {nightHours > 0 ? formatHours(nightHours) : "00:00"}
                      </td>
                      <td>
                        {record?.overtime_type_id === 1 ? (
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

export default TeamLeaderTable;
