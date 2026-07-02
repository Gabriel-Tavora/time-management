//react
import { useState } from "react";
import { NavLink } from "react-router-dom";
//CSS
import "./SideBar.css";

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
          <div className="logo-icon">{expanded && <FaClock />}</div>
          <div className="logo">{expanded && <h2>Time Manager</h2>}</div>

          <button className="toggle-btn" onClick={() => setExpanded(!expanded)}>
            {expanded ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>

        <ul className="menu">
          <li>
            <NavLink to="/userscreen" className="menu-link-list">
              <FaHome />
              {expanded && <span>Meu Painel</span>}
            </NavLink>
          </li>

          <li>
            <NavLink to="/registerhours" className="menu-link-list">
              <FaClock />
              {expanded && <span>Registrar Horas Extras</span>}
            </NavLink>
          </li>

          <li>
            <NavLink className="menu-link-list">
              <FaUserCircle />
              {expanded && <span>Histórico</span>}
            </NavLink>
          </li>

          <li>
            <NavLink className="menu-link-list">
              <FaCalendarAlt />
              {expanded && <span>Calendário</span>}
            </NavLink>
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
          <NavLink to="/" className="menu-link">
            {expanded && <span>Sair</span>}
            <FaChevronRight className="leave-icon" />
          </NavLink>
        </div>
      </nav>
    </aside >
  );
}

export default Sidebar;
