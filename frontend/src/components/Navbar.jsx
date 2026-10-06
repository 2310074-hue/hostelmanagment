import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Top bar shown above the page content, with a mobile sidebar toggle and logout.
const Navbar = ({ onToggleSidebar, title }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(role === "admin" ? "/admin/login" : "/login");
  };

  return (
    <div className="hcms-topbar">
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-outline-secondary sidebar-toggle-btn" onClick={onToggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
        <h5 className="mb-0">{title}</h5>
      </div>
      <div className="d-flex align-items-center gap-3">
        <span className="d-none d-sm-inline text-muted">
          <i className="bi bi-person-circle me-1"></i>
          {user?.fullName} {role === "admin" && <span className="badge bg-dark ms-1">Admin</span>}
        </span>
        <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
