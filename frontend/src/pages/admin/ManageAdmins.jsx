import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import SuccessMessage from "../../components/SuccessMessage";
import Modal from "../../components/Modal";
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from "../../services/adminService";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const ManageAdmins = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const loadAdmins = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (err) {
      setError("Unable to load admins. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const validateForm = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Admin name is required.";
    if (!form.email) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (form.confirmPassword !== form.password) errs.confirmPassword = "Passwords must match.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!validateForm()) return;
    setSaving(true);
    try {
      const newAdmin = await createAdmin({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      setAdmins((prev) => [newAdmin, ...prev]);
      setSuccess("New admin created successfully.");
      setShowForm(false);
      setForm(initialForm);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to create admin. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (admin) => {
    setError("");
    setSuccess("");
    try {
      const updated = await updateAdmin(admin.id, {
        status: admin.status === "Active" ? "Inactive" : "Active",
      });
      setAdmins((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setSuccess(`Admin ${updated.status === "Active" ? "activated" : "deactivated"} successfully.`);
    } catch (err) {
      setError("Unable to update admin status.");
    }
  };

  const handleDelete = async (admin) => {
    if (admin.id === user.id) {
      setError("You cannot delete your own admin account.");
      return;
    }
    if (!window.confirm(`Delete admin ${admin.fullName}? This cannot be undone.`)) return;

    setError("");
    setSuccess("");
    try {
      await deleteAdmin(admin.id);
      setAdmins((prev) => prev.filter((item) => item.id !== admin.id));
      setSuccess("Admin deleted successfully.");
    } catch (err) {
      setError("Unable to delete admin. Please try again.");
    }
  };

  const sortedAdmins = useMemo(
    () => admins.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [admins]
  );

  return (
    <Layout role="admin" title="Manage Admins">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h5 className="mb-0">Manage Admins</h5>
          <p className="text-muted small mb-0">Create, activate, deactivate, or remove admin accounts.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <i className="bi bi-plus-circle me-1"></i> Add New Admin
        </button>
      </div>

      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      {loading ? (
        <LoadingSpinner text="Loading admins..." />
      ) : (
        <div className="hcms-card p-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Created Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedAdmins.map((admin) => (
                  <tr key={admin.id}>
                    <td>#{admin.id}</td>
                    <td>{admin.fullName}</td>
                    <td>{admin.email}</td>
                    <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${admin.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                        {admin.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-info me-1"
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setShowDetails(true);
                        }}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-sm btn-outline-warning me-1"
                        onClick={() => handleToggleStatus(admin)}
                      >
                        {admin.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(admin)}
                        disabled={admin.id === user.id}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedAdmins.length === 0 && (
              <div className="empty-state">
                <div className="icon"><i className="bi bi-shield-lock"></i></div>
                <h6>No admins found</h6>
                <p className="mb-0">Add a new admin to get started.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Modal
        show={showForm}
        onClose={() => {
          setShowForm(false);
          setForm(initialForm);
          setFormErrors({});
          setError("");
        }}
        title="Add New Admin"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : "Create Admin"}
            </button>
          </>
        }
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-3">
            <label className="form-label">Admin Name</label>
            <input
              type="text"
              className={`form-control ${formErrors.fullName ? "is-invalid" : ""}`}
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
            />
            {formErrors.fullName && <div className="invalid-feedback">{formErrors.fullName}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
            {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${formErrors.password ? "is-invalid" : ""}`}
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            />
            {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className={`form-control ${formErrors.confirmPassword ? "is-invalid" : ""}`}
              value={form.confirmPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            />
            {formErrors.confirmPassword && <div className="invalid-feedback">{formErrors.confirmPassword}</div>}
          </div>
        </form>
      </Modal>

      <Modal
        show={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedAdmin(null);
        }}
        title="Admin Details"
        footer={<button className="btn btn-secondary" onClick={() => setShowDetails(false)}>Close</button>}
      >
        {selectedAdmin ? (
          <div>
            <p><strong>Name:</strong> {selectedAdmin.fullName}</p>
            <p><strong>Email:</strong> {selectedAdmin.email}</p>
            <p><strong>Status:</strong> {selectedAdmin.status}</p>
            <p><strong>Created:</strong> {new Date(selectedAdmin.createdAt).toLocaleString()}</p>
            <p><strong>ID:</strong> #{selectedAdmin.id}</p>
          </div>
        ) : (
          <p>No admin selected.</p>
        )}
      </Modal>
    </Layout>
  );
};

export default ManageAdmins;
