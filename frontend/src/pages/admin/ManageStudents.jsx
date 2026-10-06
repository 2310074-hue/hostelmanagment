import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import SearchBar from "../../components/SearchBar";
import { getAllStudents } from "../../services/studentService";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getAllStudents();
        setStudents(data);
      } catch (err) {
        setError("Unable to load students. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return students;
    const q = search.toLowerCase();
    return students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.hostelName.toLowerCase().includes(q)
    );
  }, [students, search]);

  return (
    <Layout role="admin" title="Manage Students">
      <div className="hcms-card p-3 mb-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, ID, email, or hostel..." />
      </div>

      {loading && <LoadingSpinner text="Loading students..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div className="hcms-card p-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Hostel</th>
                  <th>Room</th>
                  <th>Mobile</th>
                  <th>Total Complaints</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>{s.studentId}</td>
                    <td>{s.fullName}</td>
                    <td>{s.email}</td>
                    <td>{s.hostelName}</td>
                    <td>{s.roomNumber}</td>
                    <td>{s.mobile}</td>
                    <td><span className="badge bg-primary-subtle text-primary">{s.totalComplaints}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="empty-state">
                <div className="icon"><i className="bi bi-people"></i></div>
                <h6>No students found</h6>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ManageStudents;
