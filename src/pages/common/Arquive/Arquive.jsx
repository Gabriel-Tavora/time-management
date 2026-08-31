import React from 'react'
//css
import "./Arquive.css"
const Arquive = () => {
  return (
    <div className="pdf-arquive">
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
    </div>
  )
}

export default Arquive;