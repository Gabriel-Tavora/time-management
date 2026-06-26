import { useState } from "react";
import "./SideBar.css"

import {
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaClock,
  FaCalendarAlt,
  FaCog,
  FaUserCircle,
} from "react-icons/fa";

function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className={expanded ? "sidebar open" : "sidebar"}>
      <nav>

        <div className="sidebar-header">
          <div className="logo-icon">
            {expanded && <FaClock />}
          </div>
          <div className="logo">
            {expanded && <h2>Time Manager</h2>}
          </div>

          <button
            className="toggle-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>

        <ul className="menu">

          <li>
            <FaHome />
            {expanded && <span>Meu Painel</span>}
          </li>

          <li>
            <FaClock />
            {expanded && <span>Registrar Horas Extras</span>}
          </li>

          <li>
            <FaUserCircle />
            {expanded && <span>Meus Registros</span>}
          </li>

          <li>
            <FaCalendarAlt />
            {expanded && <span>Calendário</span>}
          </li>

        </ul>

        <div className="profile">

          <FaUserCircle className="profile-icon" />

          {expanded && (
            <div className="profile-info">
              <h4>John Doe</h4>
              <p>johndoe@gmail.com</p>
            </div>
          )}

          {expanded && <FaBars />}
        </div>
        <div className="leave">
          {expanded && <span>Sair</span>}
          <FaChevronRight className="leave-icon" />
        </div>

      </nav>
    </aside>
  );
}

export default Sidebar;