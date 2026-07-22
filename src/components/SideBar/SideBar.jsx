//react
import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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
//context
import { useAuthValue } from "../../context/TokenContext";

//services
import { getCurrentUser } from '../../services/userData.js';

function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate();
  const location = useLocation();
  //logout atribuição
  const { logout, token } = useAuthValue();
  //token
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  useEffect(() => {
    const getData = async () => {
      const data = await getCurrentUser(token);
      setUserData(data);
      return;
    }
    getData();
  }, [token]);

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
            <NavLink to="/Teamleader" className={({ isActive }) => (isActive ? "menu-link-list-on" : "menu-link-list-off")}>
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
            <NavLink to="/calendary" className={({ isActive }) => (isActive ? "menu-link-list-on" : "menu-link-list-off")}>
              <FaCalendarAlt />
              {expanded && <span>Calendário</span>}
            </NavLink>
          </li>
        </ul>

        <NavLink to="/UserStats" className={({ isActive }) => (isActive ? "profile-on" : "profile")}>
          <FaUserCircle className="profile-icon" />
          {expanded && (
            <div className="profile-info">
              <div>
                <h4>{userData?.name}</h4>
                <p>{userData?.email}</p>
              </div>
              {expanded && <FaBars className="profile-icon-end" />}
            </div>
          )}
        </NavLink>

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
