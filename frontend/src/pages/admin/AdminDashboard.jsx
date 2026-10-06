import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import DashboardCard from "../../components/DashboardCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import ComplaintTable from "../../components/ComplaintTable";
import { getDashboardStats, getComplaints } from "../../services/complaintService";
import { getAllStudents } from "../../services/studentService";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [statData, complaintData, studentData] = await Promise.all([
          getDashboardStats({ role: "admin" }),
          getComplaints({}),
          getAllStudents(),
        ]);
        setStats(statData);
        setRecent(complaintData.slice(0, 6));
        setStudents(studentData.slice(0, 5));
      } catch (err) {
        setError("Unable to load dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Layout role="admin" title="Admin Dashboard">
      <h4 className="mb-1">Overview</h4>
      <p className="text-muted mb-4">Hostel-wide complaint statistics.</p>

      {loading && <LoadingSpinner text="Loading dashboard..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && stats && (
        <>
          <div className="row">
            <DashboardCard title="Total Students" value={stats.totalStudents} icon="bi-people" colorClass="bg-grad-dark" />
            <DashboardCard title="Total Complaints" value={stats.totalComplaints} icon="bi-card-checklist" colorClass="bg-grad-primary" />
            <DashboardCard title="Pending" value={stats.pending} icon="bi-hourglass-split" colorClass="bg-grad-warning" />
            <DashboardCard title="In Progress" value={stats.inProgress} icon="bi-arrow-repeat" colorClass="bg-grad-info" />
            <DashboardCard title="Resolved" value={stats.resolved} icon="bi-check-circle" colorClass="bg-grad-success" />
            <DashboardCard title="Rejected" value={stats.rejected} icon="bi-x-circle" colorClass="bg-grad-danger" />
          </div>

          {/* Quick Access to Mess Food Matrix Audit */}
          <div className="row g-3 mt-1">
            <div className="col-12">
              <div className="p-3 rounded-3 bg-white border border-danger-subtle shadow-sm d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="d-flex align-items-center gap-3">
                  <span className="badge bg-danger-subtle text-danger p-3 rounded-circle fs-4">
                    <i className="bi bi-shield-lock-fill"></i>
                  </span>
                  <div>
                    <h6 className="mb-0 fw-bold">Mess Food Quality & Contractor Accountability Matrix</h6>
                    <small className="text-muted">Live student ratings, hygiene index audits & contractor notices</small>
                  </div>
                </div>
                <Link to="/admin/mess-matrix" className="btn btn-sm btn-danger text-nowrap px-3">
                  Manage Mess Matrix →
                </Link>
              </div>
            </div>
          </div>

          <div className="row g-3 mt-3">
            <div className="col-lg-7">
              <div className="hcms-card p-3 h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Recent Complaints</h6>
                  <Link to="/admin/complaints" className="small">View All →</Link>
                </div>
                <ComplaintTable complaints={recent} basePath="/admin/complaints" showStudent />
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hcms-card p-3 h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Recent Students</h6>
                  <Link to="/admin/students" className="small">View All →</Link>
                </div>
                <div className="list-group list-group-flush">
                  {students.map((student) => (
                    <div key={student.id} className="list-group-item px-0 py-2">
                      <div className="fw-semibold">{student.fullName}</div>
                      <small className="text-muted">{student.email}</small>
                    </div>
                  ))}
                  {students.length === 0 && <div className="text-center text-muted py-4">No students found yet.</div>}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default AdminDashboard;
