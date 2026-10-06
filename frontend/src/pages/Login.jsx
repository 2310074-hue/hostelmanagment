import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginStudent } from "../services/authService";
import ErrorMessage from "../components/ErrorMessage";

const Login = () => {
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
    if (!form.email.trim()) errs.email = "Email address is required.";
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
      const data = await loginStudent(form.email, form.password);
      login(data, remember);
      navigate("/student/dashboard");
    } catch (err) {
      setApiError(err?.response?.data?.message || err?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pro-auth-page">
      {/* Background glowing gradient orbs */}
      <div className="auth-glow-orb orb-1"></div>
      <div className="auth-glow-orb orb-2"></div>
      <div className="auth-glow-orb orb-3"></div>

      <div className="container py-4">
        <div className="pro-auth-container">
          {/* Left Hero & Feature Highlight Panel */}
          <div className="pro-auth-brand-side">
            <div className="brand-header d-flex align-items-center gap-3">
              <div className="brand-logo-icon">
                <i className="bi bi-building-fill-gear"></i>
              </div>
              <div>
                <h4 className="mb-0 fw-extrabold text-white tracking-tight">HostelOps</h4>
                <span className="brand-badge-pill">SMART HCMS 2.0</span>
              </div>
            </div>

            <div className="brand-body my-auto py-4">
              <h2 className="brand-hero-title text-white fw-bold">
                Student Complaint & <br />
                <span className="text-gradient-amber">Mess Food Ecosystem</span>
              </h2>
              <p className="brand-hero-desc text-white-50">
                Experience seamless hostel living with live Swiggy-style technician dispatch, OTP proof of resolution, and real-time mess nutrition audits.
              </p>

              {/* Feature Showcase Badges */}
              <div className="feature-badges-grid mt-4">
                <div className="feature-item-pill">
                  <span className="feat-icon bg-blue"><i className="bi bi-bicycle"></i></span>
                  <div>
                    <span className="feat-title">Swiggy-Style Live Tracking</span>
                    <span className="feat-sub">Real-time technician updates</span>
                  </div>
                </div>

                <div className="feature-item-pill">
                  <span className="feat-icon bg-green"><i className="bi bi-shield-lock-fill"></i></span>
                  <div>
                    <span className="feat-title">OTP-Verified Resolution</span>
                    <span className="feat-sub">100% genuine fix assurance</span>
                  </div>
                </div>

                <div className="feature-item-pill">
                  <span className="feat-icon bg-amber"><i className="bi bi-egg-fried"></i></span>
                  <div>
                    <span className="feat-title">Mess Food & Hygiene Matrix</span>
                    <span className="feat-sub">Daily meal ratings & calorie log</span>
                  </div>
                </div>

                <div className="feature-item-pill">
                  <span className="feat-icon bg-purple"><i className="bi bi-mic-fill"></i></span>
                  <div>
                    <span className="feat-title">Private Chat & Voice Notes</span>
                    <span className="feat-sub">Instant staff communication</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="brand-footer d-flex align-items-center justify-content-between pt-3 border-top border-white border-opacity-10 text-white-50 small">
              <span><i className="bi bi-shield-check text-success me-1"></i> ISO 27001 Certified Security</span>
              <span>v2.4 Pro</span>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="pro-auth-form-side">
            {/* Top Role Switcher Tabs */}
            <div className="role-switch-container mb-4">
              <Link to="/login" className="role-switch-btn active">
                <i className="bi bi-mortarboard-fill me-2"></i> Student Portal
              </Link>
              <Link to="/admin/login" className="role-switch-btn">
                <i className="bi bi-shield-lock-fill me-2"></i> Admin Portal
              </Link>
            </div>

            <div className="form-header mb-4">
              <h3 className="fw-bold text-dark mb-1">Student Sign In</h3>
              <p className="text-muted small mb-0">Enter your university hostel credentials to access your dashboard</p>
            </div>

            {apiError && <ErrorMessage message={apiError} />}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email input with icon */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">College / Hostel Email</label>
                <div className="input-group input-group-pro">
                  <span className="input-group-text">
                    <i className="bi bi-envelope-fill text-muted"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    value={form.email}
                    onChange={handleChange}
                    placeholder="e.g. rohan@example.com"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <div className="text-danger extra-small mt-1">{errors.email}</div>}
              </div>

              {/* Password input with show/hide toggle */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-bold text-secondary mb-0">Password</label>
                  <span className="extra-small text-primary fst-italic" style={{ cursor: "pointer" }}>
                    Forgot password?
                  </span>
                </div>
                <div className="input-group input-group-pro">
                  <span className="input-group-text">
                    <i className="bi bi-lock-fill text-muted"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter account password"
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
                    id="remember"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                  />
                  <label className="form-check-label small text-muted" htmlFor="remember">
                    Remember my login
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn btn-primary-gradient w-100 py-2 fw-bold text-white shadow-sm d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Student Dashboard</span>
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4 pt-3 border-top">
              <p className="text-muted small mb-0">
                New hosteller?{" "}
                <Link to="/register" className="fw-bold text-primary text-decoration-none">
                  Register student account <i className="bi bi-arrow-up-right small"></i>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
