import React from "react";

// Generic statistic card used on both Student and Admin dashboards.
// Props: title, value, icon (bootstrap-icons class), colorClass (bg-grad-*)
const DashboardCard = ({ title, value, icon, colorClass }) => (
  <div className="col-sm-6 col-lg-4 col-xl mb-3">
    <div className={`stat-card ${colorClass}`}>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="stat-value">{value}</div>
          <div className="small opacity-75">{title}</div>
        </div>
        <i className={`bi ${icon} stat-icon`}></i>
      </div>
    </div>
  </div>
);

export default DashboardCard;
