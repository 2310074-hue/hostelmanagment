import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerStudent } from "../services/authService";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  studentId: "",
  roomNumber: "",
  hostelName: "Ganga Hostel",
  mobile: "",
};

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required.";
    if (!form.email.trim()) errs.email = "Email address is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.studentId.trim()) errs.studentId = "Student ID (Roll No) is required.";
    if (!form.mobile.trim()) errs.mobile = "10-digit mobile number required.";
    else if (!/^[0-9]{10}$/.test(form.mobile.trim())) errs.mobile = "Enter valid 10-digit mobile number.";
    if (!form.hostelName) errs.hostelName = "Select your hostel.";
    if (!form.roomNumber.trim()) errs.roomNumber = "Room number is required (e.g. A-101).";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (form.confirmPassword !== form.password) errs.confirmPassword = "Passwords do not match.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccess("");
    if (!validate()) return;

    setLoading(true);
    try {
      await registerStudent(form);
      setSuccess("Account successfully registered! Redirecting to student login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setApiError(err?.response?.data?.message || err?.message || "Unable to register student. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pro-auth-page">
      <div className="auth-glow-orb orb-1"></div>
      <div className="auth-glow-orb orb-2"></div>
      <div className="auth-glow-orb orb-3"></div>

      <div className="container py-4">
        <div className="pro-auth-container register-container">
          {/* Left Brand Panel */}
          <div className="pro-auth-brand-side">
            <div className="brand-header d-flex align-items-center gap-3">
              <div className="brand-logo-icon">
                <i className="bi bi-person-badge-fill"></i>
              </div>
              <div>
                <h4 className="mb-0 fw-extrabold text-white tracking-tight">HostelOps</h4>
                <span className="brand-badge-pill">RESIDENT ONBOARDING</span>
              </div>
            </div>

            <div className="brand-body my-auto py-4">
              <h2 className="brand-hero-title text-white fw-bold">
                Join 1,400+ Students in <br />
                <span className="text-gradient-amber">Smart Hostel Living</span>
              </h2>
              <p className="brand-hero-desc text-white-50">
                Create your student profile to access 24/7 maintenance tracking, mess quality rating, and direct technician coordination.
              </p>

              <div className="registration-perks-list mt-4">
                <div className="d-flex align-items-center gap-2 text-white-50 mb-2">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>Zero-delay complaint ticketing with auto-technician routing</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-white-50 mb-2">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>Secure 4-digit OTP resolution verification</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-white-50">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>Daily mess food nutrition, hygiene & issue reporting</span>
                </div>
              </div>
            </div>

            <div className="brand-footer d-flex align-items-center justify-content-between pt-3 border-top border-white border-opacity-10 text-white-50 small">
              <span>Hostel Resident Portal</span>
              <span>Need help? Contact Warden Desk</span>
            </div>
          </div>

          {/* Right Registration Form */}
          <div className="pro-auth-form-side">
            <div className="form-header mb-3">
              <h3 className="fw-bold text-dark mb-1">Create Student Account</h3>
              <p className="text-muted small mb-0">Fill in your university hostel credentials</p>
            </div>

            {apiError && <ErrorMessage message={apiError} />}
            {success && <SuccessMessage message={success} />}

            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-2">
                {/* Full Name */}
                <div className="col-md-6 mb-2">
                  <label className="form-label small fw-bold text-secondary mb-1">Full Name</label>
                  <div className="input-group input-group-pro input-group-sm">
                    <span className="input-group-text"><i className="bi bi-person text-muted"></i></span>
                    <input
                      type="text"
                      name="fullName"
                      className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Rohan Deshmukh"
                    />
                  </div>
                  {errors.fullName && <div className="text-danger extra-small mt-1">{errors.fullName}</div>}
                </div>

                {/* Email */}
                <div className="col-md-6 mb-2">
                  <label className="form-label small fw-bold text-secondary mb-1">Email Address</label>
                  <div className="input-group input-group-pro input-group-sm">
                    <span className="input-group-text"><i className="bi bi-envelope text-muted"></i></span>
                    <input
                      type="email"
                      name="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      value={form.email}
                      onChange={handleChange}
                      placeholder="e.g. rohan@example.com"
                    />
                  </div>
                  {errors.email && <div className="text-danger extra-small mt-1">{errors.email}</div>}
                </div>

                {/* Student ID */}
                <div className="col-md-6 mb-2">
                  <label className="form-label small fw-bold text-secondary mb-1">Student ID / Roll No</label>
                  <div className="input-group input-group-pro input-group-sm">
                    <span className="input-group-text"><i className="bi bi-card-text text-muted"></i></span>
                    <input
                      type="text"
                      name="studentId"
                      className={`form-control ${errors.studentId ? "is-invalid" : ""}`}
                      value={form.studentId}
                      onChange={handleChange}
                      placeholder="e.g. STU1001"
                    />
                  </div>
                  {errors.studentId && <div className="text-danger extra-small mt-1">{errors.studentId}</div>}
                </div>

                {/* Mobile */}
                <div className="col-md-6 mb-2">
                  <label className="form-label small fw-bold text-secondary mb-1">Mobile Number</label>
                  <div className="input-group input-group-pro input-group-sm">
                    <span className="input-group-text"><i className="bi bi-phone text-muted"></i></span>
                    <input
                      type="text"
                      name="mobile"
                      maxLength={10}
                      className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                      value={form.mobile}
                      onChange={handleChange}
                      placeholder="10-digit number"
                    />
                  </div>
                  {errors.mobile && <div className="text-danger extra-small mt-1">{errors.mobile}</div>}
                </div>

                {/* Hostel Name */}
                <div className="col-md-6 mb-2">
                  <label className="form-label small fw-bold text-secondary mb-1">Hostel Block</label>
                  <div className="input-group input-group-pro input-group-sm">
                    <span className="input-group-text"><i className="bi bi-building text-muted"></i></span>
                    <select
                      name="hostelName"
                      className="form-select form-select-sm"
                      value={form.hostelName}
                      onChange={handleChange}
                    >
                      <option value="Ganga Hostel">Ganga Hostel (Boys)</option>
                      <option value="Yamuna Hostel">Yamuna Hostel (Girls)</option>
                      <option value="Saraswati Hostel">Saraswati Hostel</option>
                      <option value="Kaveri Hostel">Kaveri Hostel</option>
                    </select>
                  </div>
                </div>

                {/* Room Number */}
                <div className="col-md-6 mb-2">
                  <label className="form-label small fw-bold text-secondary mb-1">Room Number</label>
                  <div className="input-group input-group-pro input-group-sm">
                    <span className="input-group-text"><i className="bi bi-door-closed text-muted"></i></span>
                    <input
                      type="text"
                      name="roomNumber"
                      className={`form-control ${errors.roomNumber ? "is-invalid" : ""}`}
                      value={form.roomNumber}
                      onChange={handleChange}
                      placeholder="e.g. A-101"
                    />
                  </div>
                  {errors.roomNumber && <div className="text-danger extra-small mt-1">{errors.roomNumber}</div>}
                </div>

                {/* Password */}
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold text-secondary mb-1">Password</label>
                  <div className="input-group input-group-pro input-group-sm">
                    <span className="input-group-text"><i className="bi bi-lock text-muted"></i></span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min. 6 characters"
                    />
                  </div>
                  {errors.password && <div className="text-danger extra-small mt-1">{errors.password}</div>}
                </div>

                {/* Confirm Password */}
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold text-secondary mb-1">Confirm Password</label>
                  <div className="input-group input-group-pro input-group-sm">
                    <span className="input-group-text"><i className="bi bi-shield-lock text-muted"></i></span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                    />
                  </div>
                  {errors.confirmPassword && <div className="text-danger extra-small mt-1">{errors.confirmPassword}</div>}
                </div>
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showPw"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label className="form-check-label small text-muted" htmlFor="showPw">
                  Show passwords
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary-gradient w-100 py-2 fw-bold text-white shadow-sm d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>Creating Student Account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Student Registration</span>
                    <i className="bi bi-check-circle-fill"></i>
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-3 pt-2 border-top">
              <p className="text-muted small mb-0">
                Already registered?{" "}
                <Link to="/login" className="fw-bold text-primary text-decoration-none">
                  Sign in here <i className="bi bi-arrow-right small"></i>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
