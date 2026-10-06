import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import ComplaintTable from "../../components/ComplaintTable";
import ComplaintCard from "../../components/ComplaintCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { useAuth } from "../../context/AuthContext";
import { getComplaints } from "../../services/complaintService";

const MyComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("table"); // table | card

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getComplaints({ studentId: user.id });
        setComplaints(data);
      } catch (err) {
        setError("Unable to load complaints. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.id]);

  return (
    <Layout role="student" title="My Complaints">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">All My Complaints ({complaints.length})</h5>
        <div className="btn-group">
          <button className={`btn btn-sm btn-outline-secondary ${view === "table" ? "active" : ""}`} onClick={() => setView("table")}>
            <i className="bi bi-table"></i>
          </button>
          <button className={`btn btn-sm btn-outline-secondary ${view === "card" ? "active" : ""}`} onClick={() => setView("card")}>
            <i className="bi bi-grid"></i>
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner text="Loading complaints..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        view === "table" ? (
          <div className="hcms-card p-3">
            <ComplaintTable complaints={complaints} basePath="/student/complaints" />
          </div>
        ) : (
          <div className="row">
            {complaints.map((c) => (
              <ComplaintCard key={c.id} complaint={c} basePath="/student/complaints" />
            ))}
          </div>
        )
      )}
    </Layout>
  );
};

export default MyComplaints;
