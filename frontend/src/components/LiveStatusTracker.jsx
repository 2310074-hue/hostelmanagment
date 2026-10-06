import React, { useState } from "react";
import { TRACKER_STAGES, SAMPLE_TECHNICIANS } from "../utils/constants";
import PriorityBadge from "./PriorityBadge";

const LiveStatusTracker = ({
  complaint,
  role = "student",
  onStageChange,
  onVerifyOtp,
  onAssignTechnician,
}) => {
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [selectedTechId, setSelectedTechId] = useState(
    complaint.technician ? complaint.technician.id : SAMPLE_TECHNICIANS[0].id
  );

  const currentStageKey = complaint.trackerStage || (complaint.status === "Resolved" ? "RESOLVED" : "SUBMITTED");
  const stageKeys = TRACKER_STAGES.map((s) => s.key);
  const currentStageIndex = stageKeys.indexOf(currentStageKey) !== -1 ? stageKeys.indexOf(currentStageKey) : 0;
  const isResolved = currentStageKey === "RESOLVED" || complaint.status === "Resolved";
  const isRejected = complaint.status === "Rejected";

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!enteredOtp || enteredOtp.length !== 4) {
      setOtpError("Please enter a valid 4-digit OTP.");
      return;
    }
    setOtpError("");
    setOtpSuccess("");
    setVerifying(true);
    try {
      if (onVerifyOtp) {
        await onVerifyOtp(enteredOtp);
        setOtpSuccess("OTP verified! Complaint closed.");
        setEnteredOtp("");
      }
    } catch (err) {
      setOtpError(err.message || "Invalid OTP entered.");
    } finally {
      setVerifying(false);
    }
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    const tech = SAMPLE_TECHNICIANS.find((t) => t.id === selectedTechId);
    if (tech && onAssignTechnician) {
      onAssignTechnician(tech);
    }
  };

  return (
    <div className="swiggy-tracker-card p-4 mb-4">
      {/* Tracker Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 pb-3 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2">
            <span className="live-pulse-badge">
              <span className="pulse-ring"></span>
              <span className="pulse-dot"></span>
              LIVE TRACKER
            </span>
            <span className="text-muted small">ID: #{complaint.id}</span>
          </div>
          <h5 className="mb-0 mt-2 d-flex align-items-center gap-2">
            {isRejected ? (
              <span className="text-danger">Complaint Rejected</span>
            ) : isResolved ? (
              <span className="text-success"><i className="bi bi-patch-check-fill me-1"></i> Repair Completed & Verified</span>
            ) : (
              <span>{TRACKER_STAGES[currentStageIndex]?.label || "Processing Request"}</span>
            )}
          </h5>
        </div>
        <div className="d-flex align-items-center gap-2">
          <PriorityBadge priority={complaint.priority} />
          {complaint.otpVerified && (
            <span className="badge bg-success-subtle text-success border border-success px-2 py-1">
              <i className="bi bi-shield-lock-fill me-1"></i> OTP Verified
            </span>
          )}
        </div>
      </div>

      {/* Swiggy Timeline Bar */}
      {!isRejected ? (
        <div className="swiggy-progress-wrapper my-4">
          <div className="swiggy-track">
            {TRACKER_STAGES.map((stg, idx) => {
              const isCompleted = idx < currentStageIndex || isResolved;
              const isCurrent = idx === currentStageIndex && !isResolved;

              let stepClass = "step-upcoming";
              if (isCompleted) stepClass = "step-completed";
              if (isCurrent) stepClass = "step-active";

              return (
                <div key={stg.key} className={`swiggy-step ${stepClass}`}>
                  <div className="step-icon-node">
                    {isCompleted ? (
                      <i className="bi bi-check-lg"></i>
                    ) : (
                      <i className={`bi ${stg.icon}`}></i>
                    )}
                  </div>
                  <div className="step-content">
                    <span className="step-title">{stg.label}</span>
                    <span className="step-desc d-none d-md-block">{stg.description}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="alert alert-danger d-flex align-items-center gap-3">
          <i className="bi bi-x-circle-fill fs-3"></i>
          <div>
            <strong>Complaint Rejected</strong>
            <div>This ticket was reviewed and rejected. Reason: {complaint.adminResponse || "Does not meet hostel maintenance guidelines."}</div>
          </div>
        </div>
      )}

      {/* Technician Profile Card (If Assigned) */}
      {complaint.technician && !isRejected && (
        <div className="technician-badge-card p-3 my-3">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="tech-avatar-wrapper">
                <img
                  src={complaint.technician.avatar}
                  alt={complaint.technician.name}
                  className="tech-avatar"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80";
                  }}
                />
                <span className="online-indicator"></span>
              </div>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h6 className="mb-0 fw-bold">{complaint.technician.name}</h6>
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-0">
                    {complaint.technician.role}
                  </span>
                </div>
                <div className="text-muted small mt-1">
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  <strong>{complaint.technician.rating}</strong> ({complaint.technician.jobsCompleted} completed repairs) • Specialty: {complaint.technician.specialty}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <a
                href={`tel:${complaint.technician.phone}`}
                className="btn btn-outline-success btn-sm px-3 rounded-pill"
              >
                <i className="bi bi-telephone-fill me-1"></i> Call {complaint.technician.phone}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* OTP Resolution Module */}
      {!isRejected && (
        <div className="otp-resolution-box p-3 rounded-3 mt-3">
          <div className="row align-items-center">
            {role === "student" ? (
              /* Student OTP View */
              <div className="col-12">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                  <div>
                    <span className="badge bg-dark px-2 py-1 mb-1">
                      <i className="bi bi-shield-shaded me-1 text-warning"></i> SECRET RESOLUTION OTP
                    </span>
                    <h6 className="mb-1 fw-bold text-dark">
                      Share this OTP with technician ONLY after job completion
                    </h6>
                    <p className="text-muted small mb-0">
                      Technician cannot close the complaint without your 4-digit authorization code.
                    </p>
                  </div>
                  <div className="otp-digit-display">
                    {complaint.otpVerified ? (
                      <span className="badge bg-success fs-5 px-3 py-2">
                        <i className="bi bi-check-all me-1"></i> VERIFIED
                      </span>
                    ) : (
                      <div className="d-flex gap-2">
                        {(complaint.resolutionOtp || "4829")
                          .split("")
                          .map((digit, i) => (
                            <span key={i} className="otp-box-digit">
                              {digit}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Admin / Tech OTP Verification View */
              <div className="col-12">
                <div className="row g-3 align-items-center">
                  <div className="col-md-7">
                    <h6 className="fw-bold mb-1">
                      <i className="bi bi-shield-check text-primary me-1"></i> Student OTP Resolution Verification
                    </h6>
                    <p className="text-muted small mb-0">
                      Enter the 4-digit code provided by the student upon repair verification.
                    </p>
                    {complaint.resolutionOtp && (
                      <small className="text-muted fst-italic">
                        (Demo inspection key: <strong>{complaint.resolutionOtp}</strong>)
                      </small>
                    )}
                  </div>

                  <div className="col-md-5">
                    {complaint.otpVerified || isResolved ? (
                      <div className="alert alert-success py-2 mb-0 d-flex align-items-center gap-2">
                        <i className="bi bi-check-circle-fill fs-5"></i>
                        <span>Job Successfully Verified & Closed with Student OTP.</span>
                      </div>
                    ) : (
                      <form onSubmit={handleOtpSubmit} className="d-flex gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          className="form-control text-center fw-bold fs-5 letter-spacing-2"
                          placeholder="4-digit OTP"
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                        />
                        <button
                          type="submit"
                          className="btn btn-success text-nowrap px-3"
                          disabled={verifying || enteredOtp.length !== 4}
                        >
                          {verifying ? "Verifying..." : "Verify OTP"}
                        </button>
                      </form>
                    )}
                  </div>
                  {otpError && <div className="col-12 text-danger small">{otpError}</div>}
                  {otpSuccess && <div className="col-12 text-success small">{otpSuccess}</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Live Stage Progression Controls */}
      {role === "admin" && !isRejected && (
        <div className="admin-tracker-controls mt-4 pt-3 border-top">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
            <span className="small fw-bold text-uppercase text-muted">
              <i className="bi bi-sliders me-1"></i> Live Stage Dispatch Controller
            </span>
            <span className="small text-muted">Click any stage to fast-forward live state</span>
          </div>

          <div className="row g-2 align-items-center">
            {/* Quick Assign Dropdown if not assigned */}
            <div className="col-md-5">
              <form onSubmit={handleAssignSubmit} className="d-flex gap-2">
                <select
                  className="form-select form-select-sm"
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                >
                  {SAMPLE_TECHNICIANS.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} ({tech.role})
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn btn-sm btn-outline-primary text-nowrap">
                  Assign Tech
                </button>
              </form>
            </div>

            {/* Stage Transition Buttons */}
            <div className="col-md-7 d-flex gap-1 flex-wrap justify-content-md-end">
              {TRACKER_STAGES.map((stg) => (
                <button
                  key={stg.key}
                  type="button"
                  className={`btn btn-sm ${
                    currentStageKey === stg.key ? "btn-primary" : "btn-light border"
                  }`}
                  onClick={() => {
                    if (onStageChange) {
                      const tech = complaint.technician || SAMPLE_TECHNICIANS[0];
                      onStageChange(stg.key, tech);
                    }
                  }}
                >
                  <i className={`bi ${stg.icon} me-1`}></i>
                  {stg.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveStatusTracker;
