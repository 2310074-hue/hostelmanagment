import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";

// Responsive complaint table. `basePath` decides whether "View" links to the
// student route (/student/complaints/:id) or admin route (/admin/complaints/:id).
// If `showStudent` is true, a Student column is added (used in Admin views).
const ComplaintTable = ({ complaints, basePath, showStudent = false }) => {
  if (!complaints || complaints.length === 0) {
    return (
      <div className="empty-state">
        <div className="icon"><i className="bi bi-inbox"></i></div>
        <h6>No complaints found</h6>
        <p className="mb-0">There is nothing to show here yet.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Title</th>
            {showStudent && <th>Student</th>}
            <th>Category</th>
            <th>Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c.id}>
              <td>#{c.id}</td>
              <td>{c.title}</td>
              {showStudent && <td>{c.studentName}</td>}
              <td>{c.category}</td>
              <td>{new Date(c.createdAt).toLocaleDateString()}</td>
              <td><PriorityBadge priority={c.priority} /></td>
              <td><StatusBadge status={c.status} /></td>
              <td>
                <Link to={`${basePath}/${c.id}`} className="btn btn-sm btn-outline-primary">
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintTable;
