import React from "react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <Layout role="admin" title="My Profile">
      <div className="hcms-card p-4" style={{ maxWidth: 600 }}>
        <div className="text-center mb-4">
          <i className="bi bi-shield-lock" style={{ fontSize: "4rem", color: "var(--hcms-primary)" }}></i>
          <h5 className="mt-2 mb-0">{user?.fullName}</h5>
          <p className="text-muted small">{user?.email}</p>
          <span className="badge bg-dark">Administrator</span>
        </div>
      </div>
    </Layout>
  );
};

export default AdminProfile;
