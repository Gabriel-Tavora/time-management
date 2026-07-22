import React, { useRef, useState } from "react";
//css
import "./TeamLeaderTable.css";
//Utils
import { formatHours } from "../../utils/formatHours.js";

const TeamLeaderTable = ({ data, handleCloseMoth }) => {
  const dialogRef = useRef(null);
  const [loading, setLoading] = useState(false);
  async function handleApprove() {
    try {
      setLoading(true);
      await handleCloseMoth();

      dialogRef.current.showModal();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="Leader-main">
      <div className="Leader-title">
        <h2>Registros de Horas Extras</h2>
        <button
          className="btn"
          onClick={handleApprove}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Aprovar Fechamento"}
        </button>

        <dialog ref={dialogRef}>
          <h2>Fechamento Realizado</h2>
          <h2>com Sucesso</h2>
          <button onClick={() => dialogRef.current.close()}>
            Fechar
          </button>
        </dialog>
      </div>

      <div className="Leader-table">
        <table className="Leader-stats">
          <thead>
            <tr>
              <th>Colaborador</th>
              <th>Total de Horas Extras</th>
              <th>Total de Horas Noturnas</th>
              <th>Type</th>
              <th>Aprovação</th>
            </tr>
          </thead>

          <tbody className="Leader-body">
            {data?.map((register) => (
              <tr key={register.overtime_records.id}>
                <td>{register.users.name}</td>
                <td>{formatHours(register.overtime_records.total_hours)}</td>
                <td>{formatHours(register.overtime_records.nigth_hours)}</td>
                <td>
                  {register.overtime_records.overtime_type_id === 1
                    ? "50%"
                    : "100%"}
                </td>
                <td>
                  {register.overtime_records.overtime_type_id === 1 ? (
                    <span className="status pending">Pendente</span>
                  ) : (
                    <span className="status approved">Aprovado</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamLeaderTable;