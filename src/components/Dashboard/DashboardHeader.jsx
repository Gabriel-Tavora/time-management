import React from 'react'
//css
import "./DashboardHeader.css"
import { FaCalendarAlt} from "react-icons/fa";

const DashboardHeader = ({user,formatted}) => {
  return (
    <div className="main-header">
      <div className="main-header-title">
        {user && <h1>Olá, {user?.display_name}</h1>}
        <p>Acompanhe suas Horas Extras.</p>
      </div>

      <div className="main-header-time">
        <h2>
          {formatted}
        </h2>
        <FaCalendarAlt />
      </div>
    </div>
  )
}

export default DashboardHeader