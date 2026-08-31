import React from 'react'
//css
import "./PdfsMonth.css"
//components
import Sidebar from "../../../components/Layouts/SideBar/SideBar.jsx";

const PdfsMonth = () => {


  return (
    <div className="dashboard-screen">

      <Sidebar />
     <main className="main-informations">
       <div className="pdf-list">
        <a className="pdf-item">
          <span className="pdf-icon">📄</span>
          <span className="pdf-info">
            <strong>Manual do Sistema</strong>
            <small>PDF</small>
          </span>
        </a>

        <a className="pdf-item">
          <span className="pdf-icon">📄</span>
          <span className="pdf-info">
            <strong>Regulamento</strong>
            <small>PDF</small>
          </span>
        </a>
      </div>
     </main>
    </div>
  )
}

export default PdfsMonth;