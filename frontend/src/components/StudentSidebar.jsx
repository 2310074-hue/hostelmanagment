import React from "react";
import { NavLink } from "react-router-dom";

// Sidebar navigation shown on all student pages.
const StudentSidebar = ({ open }) => (
  <nav className={`hcms-sidebar ${open ? "open" : ""}`}>
    <div className="brand">
      <i className="bi bi-building me-2"></i>Hostel HCMS
    </div>
    <ul className="nav flex-column">
      <li className="nav-item">
        <NavLink to="/student/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <i className="bi bi-speedometer2"></i> Dashboard
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/student/submit-complaint" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <i className="bi bi-plus-circle"></i> Submit Complaint
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/student/complaints" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <i className="bi bi-card-checklist"></i> My Complaints
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/student/mess-matrix" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <i className="bi bi-egg-fried text-warning"></i> Mess Matrix
          <span className="badge bg-danger ms-auto small" style={{ fontSize: "0.68rem" }}>LIVE</span>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/student/profile" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <i className="bi bi-person-circle"></i> Profile
        </NavLink>
      </li>
    </ul>
  </nav>
);

export default StudentSidebar;

