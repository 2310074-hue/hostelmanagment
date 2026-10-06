import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginAdmin } from "../../services/authService";
import ErrorMessage from "../../components/ErrorMessage";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };


  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Admin email address is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await loginAdmin(form.email, form.password);
      login(data, remember);
      navigate("/admin/dashboard");
    } catch (err) {
      setApiError(err?.response?.data?.message || err?.message || "Invalid administrative credentials. Please verify your email & password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pro-auth-page admin-theme">
      {/* Background glowing gradient orbs */}
      <div className="auth-glow-orb admin-orb-1"></div>
      <div className="auth-glow-orb admin-orb-2"></div>
      <div className="auth-glow-orb admin-orb-3"></div>

      <div className="container py-4">
        <div className="pro-auth-container">
          {/* Left Hero & Administration Feature Highlight Panel */}
          <div className="pro-auth-brand-side admin-brand">
            <div className="brand-header d-flex align-items-center gap-3">
              <div className="brand-logo-icon admin-icon">
                <i className="bi bi-shield-lock-fill"></i>
              </div>
              <div>
                <h4 className="mb-0 fw-extrabold text-white tracking-tight">HostelOps</h4>
                <span className="brand-badge-pill admin-pill">WARDEN & ADMIN CONTROL</span>
              </div>
            </div>

            <div className="brand-body my-auto py-4">
              <h2 className="brand-hero-title text-white fw-bold">
                Hostel Administration & <br />
                <span className="text-gradient-rose">Dispatch Command</span>
              </h2>
              <p className="brand-hero-desc text-white-50">
                Centralized supervisor hub for live worker assignment, emergency alerts, catering contractor accountability, and resolution OTP validation.
              </p>

              {/* Feature Showcase Badges */}
              <div className="feature-badges-grid mt-4">
                <div className="feature-item-pill">
                  <span className="feat-icon bg-rose"><i className="bi bi-person-gear"></i></span>
                  <div>
                    <span className="feat-title">Technician Fleet Dispatch</span>
                    <span className="feat-sub">Assign plumbers, electricians, network staff</span>
                  </div>
                </div>

                <div className="feature-item-pill">
                  <span className="feat-icon bg-amber"><i className="bi bi-key-fill"></i></span>
                  <div>
                    <span className="feat-title">Student OTP Verification</span>
                    <span className="feat-sub">Authenticate repair before closure</span>
                  </div>
                </div>

                <div className="feature-item-pill">
                  <span className="feat-icon bg-blue"><i className="bi bi-bar-chart-line-fill"></i></span>
                  <div>
                    <span className="feat-title">Mess Quality & Hygiene Audits</span>
                    <span className="feat-sub">Enforce contractor penalties & notices</span>
                  </div>
                </div>

                <div className="feature-item-pill">
                  <span className="feat-icon bg-purple"><i className="bi bi-people-fill"></i></span>
                  <div>
                    <span className="feat-title">Student Resident Directory</span>
                    <span className="feat-sub">Room allocation & grievance history</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="brand-footer d-flex align-items-center justify-content-between pt-3 border-top border-white border-opacity-10 text-white-50 small">
              <span><i className="bi bi-lock-fill text-warning me-1"></i> Multi-Factor Admin Protection</span>
              <span>Warden Suite v2.4</span>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="pro-auth-form-side">
            {/* Top Role Switcher Tabs */}
            <div className="role-switch-container mb-4">
              <Link to="/login" className="role-switch-btn">
                <i className="bi bi-mortarboard-fill me-2"></i> Student Portal
              </Link>
              <Link to="/admin/login" className="role-switch-btn active admin-active">
                <i className="bi bi-shield-lock-fill me-2"></i> Admin Portal
              </Link>
            </div>

            <div className="form-header mb-4">
              <h3 className="fw-bold text-dark mb-1">Admin Sign In</h3>
              <p className="text-muted small mb-0">Authorized hostel warden and supervisor access only</p>
            </div>

            {apiError && <ErrorMessage message={apiError} />}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email input with icon */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Administrator Email</label>
                <div className="input-group input-group-pro">
                  <span className="input-group-text">
                    <i className="bi bi-person-fill-lock text-muted"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    value={form.email}
                    onChange={handleChange}
                    placeholder="e.g. admin@hostel.com"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <div className="text-danger extra-small mt-1">{errors.email}</div>}
              </div>

              {/* Password input with show/hide toggle */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-bold text-secondary mb-0">Master Password</label>
                  <span className="extra-small text-danger fst-italic" style={{ cursor: "pointer" }}>
                    Reset key?
                  </span>
                </div>
                <div className="input-group input-group-pro">
                  <span className="input-group-text">
                    <i className="bi bi-key-fill text-muted"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter admin master password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="input-group-text btn-eye-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"} text-muted`}></i>
                  </button>
                </div>
                {errors.password && <div className="text-danger extra-small mt-1">{errors.password}</div>}
              </div>

              {/* Remember me checkbox */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberAdmin"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                  />
                  <label className="form-check-label small text-muted" htmlFor="rememberAdmin">
                    Keep admin session active
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn btn-admin-gradient w-100 py-2 fw-bold text-white shadow-sm d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>Verifying Authority...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Admin Control Suite</span>
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4 pt-3 border-top">
              <p className="text-muted small mb-0">
                Looking for student grievance submission?{" "}
                <Link to="/login" className="fw-bold text-primary text-decoration-none">
                  Go to Student Login <i className="bi bi-arrow-right small"></i>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
