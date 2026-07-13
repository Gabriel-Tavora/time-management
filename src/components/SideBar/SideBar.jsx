//react
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
//Auth logout
import { useAuthValue } from "../../context/TokenContext";

function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const navigate = useNavigate();
  //logout atribuição
  const { logout } = useAuthValue();

  const handleLogout = (e) => {
    e.preventDefault();

    logout();
    navigate("/");
  };
  
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
            <NavLink to="/userscreen" className={({ isActive }) => (isActive ? "menu-link-list-on" : "menu-link-list-off")}>
              <FaHome />
              {expanded && <span>Meu Painel</span>}
            </NavLink>
          </li>

          <li>
            <NavLink to="/registerhours" className={({ isActive }) => (isActive ? "menu-link-list-on" : "menu-link-list-off")}>
              <FaClock />
              {expanded && <span>Registrar Horas Extras</span>}
            </NavLink>
          </li>

          <li>
            <NavLink to="/historyHours" className={({ isActive }) => (isActive ? "menu-link-list-on" : "menu-link-list-off")}>
              <FaUserCircle />
              {expanded && <span>Histórico</span>}
            </NavLink>
          </li>

          <li>
            <NavLink to="/calendary" className={({ isActive }) => (isActive ? "menu-link-list-on" : "menu-link-list-off")}>
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
          <button onClick={handleLogout} className="menu-link">
            {expanded && <span>Sair</span>}
            <FaChevronRight className="leave-icon" />
          </button>
        </div>
      </nav>
    </aside >
  );
}

export default Sidebar;
