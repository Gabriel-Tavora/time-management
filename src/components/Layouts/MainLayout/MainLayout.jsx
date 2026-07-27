import { Outlet } from "react-router-dom";

import Sidebar from "../SideBar/SideBar.jsx";
import DashboardHeader from "../Dashboard/DashboardHeader.jsx";

import "./MainLayout.css";

export default function MainLayout() {
  return (
    <div className="main-layout">

      <Sidebar />

      <div className="main-content">

        <DashboardHeader />

        <section className="page-content">
          <Outlet />
        </section>

      </div>

    </div>
  );
}