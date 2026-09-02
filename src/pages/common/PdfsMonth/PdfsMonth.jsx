import React, { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";

// CSS
import "./PdfsMonth.css";
import "../../../styles/tables.css";

// Services
import {
  getClosureMonth,
  getClosurePDFS,
} from "../../../services/closure";

// Context
import { useAuthValue } from "../../../context/TokenContext.jsx";

// Components
import Sidebar from "../../../components/Layouts/SideBar/SideBar.jsx";
import Input from "../../../components/common/Inputs/Inputs.jsx";

// Utils
import { getCurrentDate } from "../../../utils/formatHours";

const PdfsMonth = () => {
  const { token } = useAuthValue();
  const { month, year } = getCurrentDate();

  const [reports, setReports] = useState(null);
  const [pdfList, setPdfList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterDate, setFilterDate] = useState(
    `${year}-${month}`
  );

  async function loadData() {
    if (!token || !filterDate) return;

    try {
      setLoading(true);
      const period = `${filterDate}-01`;
      const report = await getClosureMonth(
        token,
        period
      );
      setReports(report);
      if (!report?.id) {
        setPdfList([]);
        return;
      }
      const pdf = await getClosurePDFS(
        token,
        report.id
      );
      setPdfList([pdf]);
    } catch (err) {
      console.error("Erro:", err);

      setReports(null);
      setPdfList([]);

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [token, filterDate]);

  return (
    <div className="pdf-page">
      <Sidebar />

      <main className="pdf-main">
        <section className="pdf-container">
          <div className="pdf-header">
            <h1>Arquivos PDF</h1>
            <p>
              Relatórios referentes ao período{" "}
              <strong>{filterDate}</strong>
            </p>
            <div className="date-filter">
              <Input
                className="teste"
                labelText="Período"
                id="filter"
                type="month"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                name="month"
              />
            </div>
          </div>
          {loading && (
            <p>Carregando relatório...</p>
          )}
          {!loading && pdfList.length === 0 && (
            <p>
              Nenhum relatório disponível para este período.
            </p>
          )}
          <div className="pdf-list">
            {pdfList.map((pdf) => (
              <a
                key={pdf.id}
                href={pdf.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pdf-item"
              >
                <FaFilePdf className="pdf-icon" />
                <div className="pdf-info">
                  <strong>
                    {reports.file_name}
                  </strong>
                  <small>
                    Documento PDF
                  </small>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PdfsMonth;