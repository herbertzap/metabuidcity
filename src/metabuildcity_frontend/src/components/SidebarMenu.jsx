import React from "react";
import { NavLink } from "react-router-dom";

const SidebarMenu = () => {
  return (
    <aside className="dashboard-sidebar">
      <nav className="sidebar-menu">
        <ul>
          <li>
            <NavLink to="/home" className={({isActive}) => isActive ? "active" : undefined} end>
              <span>EVENTOS Y HUBS</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/home/activos" className={({isActive}) => isActive ? "active" : undefined}><span>MIS ACTIVOS</span></NavLink>
          </li>
          <li>
            <NavLink to="/home/stands" className={({isActive}) => isActive ? "active" : undefined}><span>STANDS Y ADS</span></NavLink>
          </li>
          <li>
            <NavLink to="/home/indicadores" className={({isActive}) => isActive ? "active" : undefined}><span>INDICADORES</span></NavLink>
          </li>
          <li>
            <NavLink to="/home/retiros" className={({isActive}) => isActive ? "active" : undefined}><span>RETIROS</span></NavLink>
          </li>
          <li>
            <NavLink to="/home/profile" className={({isActive}) => isActive ? "active" : undefined}><span>USUARIO</span></NavLink>
          </li>
          <li className="sidebar-config">
            <NavLink to="/home/configuracion" className={({isActive}) => isActive ? "active" : undefined}><span>CONFIGURACIÓN</span></NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarMenu; 