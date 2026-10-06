import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";

// Card view of a single complaint - used on smaller screens as an
// alternative to the table (keeps the UI responsive on mobile).
const ComplaintCard = ({ complaint, basePath }) => (
  <div className="col-md-6 col-lg-4 mb-3">
    <div className="hcms-card p-3 h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h6 className="mb-0">{complaint.title}</h6>
        <StatusBadge status={complaint.status} />
      </div>
      <p className="text-muted small mb-2">{complaint.category}</p>
      <p className="small mb-2 flex-grow-1">{complaint.description?.slice(0, 80)}...</p>
      <div className="d-flex justify-content-between align-items-center mt-2">
        <PriorityBadge priority={complaint.priority} />
        <small className="text-muted">{new Date(complaint.createdAt).toLocaleDateString()}</small>
      </div>
      <Link to={`${basePath}/${complaint.id}`} className="btn btn-outline-primary btn-sm mt-3">
        View Details
      </Link>
    </div>
  </div>
);

export default ComplaintCard;
