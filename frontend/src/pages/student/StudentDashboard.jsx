import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import DashboardCard from "../../components/DashboardCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import ComplaintTable from "../../components/ComplaintTable";
import { useAuth } from "../../context/AuthContext";
import { getDashboardStats, getComplaints } from "../../services/complaintService";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [statData, complaintData] = await Promise.all([
          getDashboardStats({ role: "student", studentId: user.id }),
          getComplaints({ studentId: user.id }),
        ]);
        setStats(statData);
        setRecent(complaintData.slice(0, 5));
      } catch (err) {
        setError("Unable to load dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.id]);

  return (
    <Layout role="student" title="Student Dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="mb-1">Welcome back, {user?.fullName?.split(" ")[0]} 👋</h4>
          <p className="text-muted mb-0">Here's a summary of your hostel complaints.</p>
        </div>
        <Link to="/student/submit-complaint" className="btn btn-primary">
          <i className="bi bi-plus-circle me-1"></i> New Complaint
        </Link>
      </div>

      {loading && <LoadingSpinner text="Loading dashboard..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && stats && (
        <>
          <div className="row">
            <DashboardCard title="Total Complaints" value={stats.totalComplaints} icon="bi-card-checklist" colorClass="bg-grad-primary" />
            <DashboardCard title="Pending" value={stats.pending} icon="bi-hourglass-split" colorClass="bg-grad-warning" />
            <DashboardCard title="In Progress" value={stats.inProgress} icon="bi-arrow-repeat" colorClass="bg-grad-info" />
            <DashboardCard title="Resolved" value={stats.resolved} icon="bi-check-circle" colorClass="bg-grad-success" />
          </div>

          {/* Quick Access to Mess Matrix & Live Tracking */}
          <div className="row g-3 mt-1">
            <div className="col-md-6">
              <div className="p-3 rounded-3 bg-white border border-primary-subtle shadow-sm d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <span className="badge bg-warning-subtle text-warning p-3 rounded-circle fs-4">
                    <i className="bi bi-egg-fried"></i>
                  </span>
                  <div>
                    <h6 className="mb-0 fw-bold">Mess Food & Hygiene Live Matrix</h6>
                    <small className="text-muted">Rate today's meal, check calories & report issues</small>
                  </div>
                </div>
                <Link to="/student/mess-matrix" className="btn btn-sm btn-outline-primary text-nowrap">
                  Open Matrix →
                </Link>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 rounded-3 bg-white border border-success-subtle shadow-sm d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <span className="badge bg-primary-subtle text-primary p-3 rounded-circle fs-4">
                    <i className="bi bi-bicycle"></i>
                  </span>
                  <div>
                    <h6 className="mb-0 fw-bold">Live Status & OTP Resolution</h6>
                    <small className="text-muted">Swiggy-style dispatch tracker with voice notes & OTP</small>
                  </div>
                </div>
                <Link to="/student/complaints" className="btn btn-sm btn-outline-success text-nowrap">
                  Track Repairs →
                </Link>
              </div>
            </div>
          </div>

          <div className="hcms-card p-3 mt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">Recent Complaints</h6>
              <Link to="/student/complaints" className="small">View All →</Link>
            </div>
            <ComplaintTable complaints={recent} basePath="/student/complaints" />
          </div>
        </>
      )}
    </Layout>
  );
};

export default StudentDashboard;
