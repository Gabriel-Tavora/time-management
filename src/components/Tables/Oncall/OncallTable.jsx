import React, { useState, useEffect } from "react";
//css
import "../../../styles/tables.css";
// services
import { getMonthOncall } from "../../../services/contractData";
//utils
import {
  formatHours
} from "../../../utils/formatHours.js";
// context
import { useAuthValue } from "../../../context/TokenContext.jsx";

const OncallTable = ({ idMonth }) => {
  const { token } = useAuthValue();

  const [onCall, setOnCall] = useState([]);

  useEffect(() => {
    if (!token || !idMonth?.id) return;

    const loadData = async () => {
      try {
        const id = idMonth.id;

        const response = await getMonthOncall(token, id);

        setOnCall(response);
      } catch (error) {
        setOnCall([]);
        console.error(error);
      }
    };

    loadData();
  }, [token, idMonth]);

  return (
      <div className="table-page-small table">
        <div className="table-container">
          <table className="app-table">
            <thead>
              <tr>
                <th>Limite</th>
                <th>Utilizadas</th>
                <th>Restantes</th>
              </tr>
            </thead>

            <tbody>
              {onCall.length === 0 ? (
                <tr>
                  <td colSpan={3} className="empty-state">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                <tr>
                  <td>{onCall.limity ?? 0}</td>
                  <td>{formatHours(onCall.used ?? 0)}</td>
                  <td>{formatHours(onCall.available ?? 0)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

  );
};

export default OncallTable;