import React from "react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

const StudentProfile = () => {
  const { user } = useAuth();

  return (
    <Layout role="student" title="My Profile">
      <div className="hcms-card p-4" style={{ maxWidth: 600 }}>
        <div className="text-center mb-4">
          <i className="bi bi-person-circle" style={{ fontSize: "4rem", color: "var(--hcms-primary)" }}></i>
          <h5 className="mt-2 mb-0">{user?.fullName}</h5>
          <p className="text-muted small">{user?.email}</p>
        </div>

        <table className="table">
          <tbody>
            <tr><th>Student ID</th><td>{user?.studentId}</td></tr>
            <tr><th>Hostel Name</th><td>{user?.hostelName}</td></tr>
            <tr><th>Room Number</th><td>{user?.roomNumber}</td></tr>
            <tr><th>Mobile Number</th><td>{user?.mobile}</td></tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default StudentProfile;
