import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import PriorityBadge from "../../components/PriorityBadge";
import ImageAttachmentViewer from "../../components/ImageAttachmentViewer";
import LiveStatusTracker from "../../components/LiveStatusTracker";
import ComplaintChat from "../../components/ComplaintChat";
import {
  getComplaintById,
  sendComplaintMessage,
  updateRoomInstructions,
} from "../../services/complaintService";

const ComplaintDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("tracker"); // 'tracker' | 'chat' | 'details'

  const loadComplaint = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getComplaintById(id);
      setComplaint(data);
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

  const handleSendMessage = async (messageData) => {
    try {
      const updated = await sendComplaintMessage(id, messageData);
      setComplaint(updated);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const handleUpdateInstructions = async (roomInstructions) => {
    try {
      const updated = await updateRoomInstructions(id, roomInstructions);
      setComplaint(updated);
    } catch (err) {
      console.error("Failed to update instructions", err);
    }
  };

  return (
    <Layout role="student" title="Complaint Live Tracker & Support">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <Link to="/student/complaints" className="btn btn-sm btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i> Back to My Complaints
        </Link>
        {complaint && (
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-light border"
              onClick={loadComplaint}
              title="Refresh status"
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>
        )}
      </div>

      {loading && <LoadingSpinner text="Loading live complaint details..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && complaint && (
        <>
          {/* Swiggy-Style Live Status Tracker */}
          <LiveStatusTracker
            complaint={complaint}
            role="student"
          />

          {/* Navigation Tabs for Details & Chat */}
          <ul className="nav nav-pills mb-3 gap-2" role="tablist">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link rounded-pill px-4 ${activeTab === "tracker" ? "active shadow-sm" : "bg-white text-dark border"}`}
                onClick={() => setActiveTab("tracker")}
              >
                <i className="bi bi-chat-dots-fill me-2"></i> Private Chat & Room Instructions
                {complaint.chatMessages && complaint.chatMessages.length > 0 && (
                  <span className="badge bg-danger ms-2">{complaint.chatMessages.length}</span>
                )}
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link rounded-pill px-4 ${activeTab === "details" ? "active shadow-sm" : "bg-white text-dark border"}`}
                onClick={() => setActiveTab("details")}
              >
                <i className="bi bi-info-circle-fill me-2"></i> Full Ticket Details & Attachment
              </button>
            </li>
          </ul>

          {activeTab === "tracker" && (
            <div className="mb-4">
              <ComplaintChat
                complaint={complaint}
                role="student"
                onSendMessage={handleSendMessage}
                onUpdateInstructions={handleUpdateInstructions}
              />
            </div>
          )}

          {activeTab === "details" && (
            <div className="hcms-card p-4">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                <div>
                  <h5 className="mb-1">{complaint.title}</h5>
                  <p className="text-muted small mb-0">Complaint ID: #{complaint.id}</p>
                </div>
                <PriorityBadge priority={complaint.priority} />
              </div>

              <div className="row mt-3">
                <div className="col-md-6 mb-3">
                  <strong>Category:</strong> <div>{complaint.category}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Submitted Date:</strong> <div>{new Date(complaint.createdAt).toLocaleString()}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Hostel:</strong> <div>{complaint.hostelName}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>Room Number:</strong> <div>{complaint.roomNumber}</div>
                </div>
              </div>

              <div className="mb-3">
                <strong>Description:</strong>
                <p className="mt-1">{complaint.description}</p>
              </div>

              {(complaint.image || complaint.imageName) && (
                <div className="mb-3">
                  <ImageAttachmentViewer
                    image={complaint.image}
                    imageName={complaint.imageName}
                    title={`Complaint #${complaint.id} Attachment`}
                  />
                </div>
              )}

              <div className="alert alert-light border">
                <strong>Admin Response:</strong>
                <p className="mb-0 mt-1">{complaint.adminResponse || "No response from admin yet."}</p>
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default ComplaintDetails;

