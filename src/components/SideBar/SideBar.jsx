//react
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleMyPanel = () => {
    navigate("/userscreen");
  };
  const handleRegisterHours = () => {
    navigate("/registerhours");
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
            <button onClick={handleMyPanel}>
              <FaHome />
              {expanded && <span>Meu Painel</span>}
            </button>
          </li>

          <li>
            <button onClick={handleRegisterHours}>
              <FaClock />
              {expanded && <span>Registrar Horas Extras</span>}
            </button>
          </li>

          <li>
            <button>
              <FaUserCircle />
              {expanded && <span>Histórico</span>}
            </button>
          </li>

          <li>
            <button>
              <FaCalendarAlt />
              {expanded && <span>Calendário</span>}
            </button>
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
