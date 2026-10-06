import React from "react";
import { NavLink } from "react-router-dom";

// Sidebar navigation shown on all admin pages.
const AdminSidebar = ({ open }) => (
  <nav className={`hcms-sidebar ${open ? "open" : ""}`}>
    <div className="brand">
      <i className="bi bi-shield-lock me-2"></i>HCMS Admin
    </div>
    <ul className="nav flex-column">
      <li className="nav-item">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <i className="bi bi-speedometer2"></i> Dashboard
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/admin/complaints" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <i className="bi bi-card-list"></i> All Complaints
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/admin/complaints?status=Pending" className="nav-link">
          <i className="bi bi-hourglass-split"></i> Pending
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/admin/complaints?status=In Progress" className="nav-link">
          <i className="bi bi-arrow-repeat"></i> In Progress
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/admin/complaints?status=Resolved" className="nav-link">
          <i className="bi bi-check-circle"></i> Resolved
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/admin/mess-matrix" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <i className="bi bi-egg-fried text-warning"></i> Mess Matrix
          <span className="badge bg-danger ms-auto small" style={{ fontSize: "0.68rem" }}>AUDIT</span>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/admin/admins" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <i className="bi bi-shield-lock"></i> Manage Admins
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/admin/students" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <i className="bi bi-people"></i> Students
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/admin/profile" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <i className="bi bi-person-circle"></i> Profile
        </NavLink>
      </li>
    </ul>
  </nav>
);

export default AdminSidebar;

