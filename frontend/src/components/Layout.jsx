import React, { useState } from "react";
import Navbar from "./Navbar";
import StudentSidebar from "./StudentSidebar";
import AdminSidebar from "./AdminSidebar";

// Shared shell (sidebar + topbar + content area) for both student and admin pages.
// `role` decides which sidebar to render.
const Layout = ({ role, title, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      {role === "admin" ? <AdminSidebar open={sidebarOpen} /> : <StudentSidebar open={sidebarOpen} />}
      <div className="app-main">
        <Navbar title={title} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <div className="app-content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
