import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import SuccessMessage from "../../components/SuccessMessage";
import StatusBadge from "../../components/StatusBadge";
import PriorityBadge from "../../components/PriorityBadge";
import ImageAttachmentViewer from "../../components/ImageAttachmentViewer";
import LiveStatusTracker from "../../components/LiveStatusTracker";
import ComplaintChat from "../../components/ComplaintChat";
import {
  getComplaintById,
  updateComplaintStatus,
  updateTrackerStage,
  verifyResolutionOtp,
  sendComplaintMessage,
} from "../../services/complaintService";
import { COMPLAINT_STATUSES } from "../../utils/constants";

const AdminComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [status, setStatus] = useState("");
  const [response, setResponse] = useState("");
  const [saving, setSaving] = useState(false);

  const loadComplaint = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getComplaintById(id);
      setComplaint(data);
      setStatus(data.status);
      setResponse(data.adminResponse || "");
    } catch (err) {
      setError("Unable to load complaint details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setSaving(true);
    try {
      const updated = await updateComplaintStatus(id, status, response);
      setComplaint(updated);
      setSuccess("Complaint status and official response updated successfully.");
    } catch (err) {
      setError("Unable to update complaint status. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleStageChange = async (stage, technician) => {
    try {
      const updated = await updateTrackerStage(id, stage, technician);
      setComplaint(updated);
      setStatus(updated.status);
      setSuccess(`Live stage progressed to: ${stage}`);
    } catch (err) {
      setError("Failed to update live stage.");
    }
  };

  const handleAssignTechnician = async (technician) => {
    try {
      const updated = await updateTrackerStage(id, "ASSIGNED", technician);
      setComplaint(updated);
      setStatus("In Progress");
      setSuccess(`Assigned ${technician.name} (${technician.role}) to ticket.`);
    } catch (err) {
      setError("Failed to assign technician.");
    }
  };

  const handleVerifyOtp = async (enteredOtp) => {
    const updated = await verifyResolutionOtp(id, enteredOtp);
    setComplaint(updated);
    setStatus("Resolved");
    setSuccess("Student OTP Verified! Job marked as completed.");
  };

  const handleSendMessage = async (messageData) => {
    try {
      const updated = await sendComplaintMessage(id, messageData);
      setComplaint(updated);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <Layout role="admin" title="Complaint Management & Live Dispatch">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <Link to="/admin/complaints" className="btn btn-sm btn-outline-secondary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-1"></i> Back to All Complaints
        </Link>
        {complaint && (
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-light border"
              onClick={loadComplaint}
              title="Refresh status"
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh State
            </button>
          </div>
        )}
      </div>

      {loading && <LoadingSpinner text="Loading complaint..." />}
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      {!loading && complaint && (
        <>
          {/* Swiggy-Style Live Status Tracker with Dispatch & OTP controls */}
          <LiveStatusTracker
            complaint={complaint}
            role="admin"
            onStageChange={handleStageChange}
            onAssignTechnician={handleAssignTechnician}
            onVerifyOtp={handleVerifyOtp}
          />

          {/* Core Info & Traditional Form Row */}
          <div className="row mb-4">
            <div className="col-lg-7 mb-3">
              <div className="hcms-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="mb-1">{complaint.title}</h5>
                    <p className="text-muted small mb-0">Complaint ID: #{complaint.id} • By {complaint.studentName}</p>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>

                <div className="row mb-2">
                  <div className="col-6"><strong>Category:</strong><div>{complaint.category}</div></div>
                  <div className="col-6"><strong>Priority:</strong><div><PriorityBadge priority={complaint.priority} /></div></div>
                </div>
                <div className="row mb-2">
                  <div className="col-6"><strong>Hostel:</strong><div>{complaint.hostelName}</div></div>
                  <div className="col-6"><strong>Room:</strong><div>{complaint.roomNumber}</div></div>
                </div>
                <div className="mb-2">
                  <strong>Submitted:</strong> <div>{new Date(complaint.createdAt).toLocaleString()}</div>
                </div>
                <div className="mb-2">
                  <strong>Description:</strong>
                  <p className="mt-1">{complaint.description}</p>
                </div>
                {(complaint.image || complaint.imageName) && (
                  <ImageAttachmentViewer
                    image={complaint.image}
                    imageName={complaint.imageName}
                    title={`Complaint #${complaint.id} Attachment`}
                  />
                )}
              </div>
            </div>

            <div className="col-lg-5 mb-3">
              <div className="hcms-card p-4 h-100">
                <h6 className="mb-3">Manual Status & Response</h6>

                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                      {COMPLAINT_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <small className="text-muted">
                      Typical flow: Pending → In Progress → Resolved, or Pending → Rejected.
                    </small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Admin Response</label>
                    <textarea
                      className="form-control" rows="4"
                      value={response} onChange={(e) => setResponse(e.target.value)}
                      placeholder="Write a response visible to the student..."
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={saving}>
                    {saving ? "Saving..." : "Update Complaint Status"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Interactive Chat & Room Instructions Section */}
          <div className="mb-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-chat-square-dots-fill text-primary me-2"></i>
              Live Chat, Voice Notes & Room Entry Instructions
            </h5>
            <ComplaintChat
              complaint={complaint}
              role="admin"
              onSendMessage={handleSendMessage}
            />
          </div>
        </>
      )}
    </Layout>
  );
};

export default AdminComplaintDetails;

