// TableHour.jsx
import React from "react";

import {
  formatDate,
} from "../../../utils/formatHours.js";

const TableHour = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="table-container">
      <table className="app-table">
        <thead>
          <tr>
            <th>Data Inicial</th>
            <th>Data Final</th>
            <th>Horário Inicial</th>
            <th>Horário Final</th>
            <th>Jira</th>
          </tr>
        </thead>

        <tbody>
          {data.map((entry) => (
            <tr key={entry.id}>
              <td>{formatDate(entry.startDate)}</td>
              <td>{formatDate(entry.endDate)}</td>
              <td>{entry.startTime}</td>
              <td>{entry.endTime || "--:--"}</td>
              <td>{entry.jiraTask || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableHour;