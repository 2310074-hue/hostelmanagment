import React from "react";

const PRIORITY_STYLES = {
  Low: "secondary",
  Medium: "primary",
  High: "danger",
};

const PriorityBadge = ({ priority }) => {
  const style = PRIORITY_STYLES[priority] || "secondary";
  return <span className={`badge bg-${style}-subtle text-${style} border border-${style}`}>{priority}</span>;
};

export default PriorityBadge;
