import React from "react";

// Maps a complaint status string to a Bootstrap badge colour.
const STATUS_STYLES = {
  Pending: "warning text-dark",
  "In Progress": "info text-dark",
  Resolved: "success",
  Rejected: "danger",
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || "secondary";
  return <span className={`badge bg-${style} px-3 py-2`}>{status}</span>;
};

export default StatusBadge;
