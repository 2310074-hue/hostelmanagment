// ============================================================================
// COMPLAINT SERVICE
// ----------------------------------------------------------------------------
// Wraps all complaint-related API calls and Live Tracker / Chat features.
// ============================================================================
import axiosInstance from "../api/axios";
import { getDB, saveDB, delay } from "./mockData";
import { mockError } from "./mockError";

const USE_MOCK = process.env.REACT_APP_USE_MOCK === "true";

// Helper to generate a 4-digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// ---------------- CREATE COMPLAINT ----------------
export const submitComplaint = async (complaintData, user) => {
  if (USE_MOCK) {
    await delay();
    const db = getDB();
    const newComplaint = {
      id: db.nextComplaintId,
      studentId: user.id,
      studentName: user.fullName,
      title: complaintData.title,
      category: complaintData.category,
      description: complaintData.description,
      hostelName: complaintData.hostelName,
      roomNumber: complaintData.roomNumber,
      priority: complaintData.priority,
      status: "Pending",
      trackerStage: "SUBMITTED",
      technician: null,
      resolutionOtp: generateOTP(),
      otpVerified: false,
      roomInstructions: {
        preferredTime: complaintData.preferredTime || "Anytime",
        keyStatus: complaintData.keyStatus || "I will be present",
        callBeforeEntry: Boolean(complaintData.callBeforeEntry),
        notes: complaintData.entryNotes || "",
      },
      chatMessages: [
        {
          id: `m-${Date.now()}`,
          sender: "system",
          senderName: "HCMS Bot",
          text: `Ticket #${db.nextComplaintId} registered. A technician will be assigned shortly.`,
          timestamp: new Date().toISOString(),
          isVoiceNote: false,
        },
      ],
      adminResponse: "",
      image: complaintData.image || complaintData.imageName || null,
      imageName: complaintData.imageName || (typeof complaintData.image === "string" && !complaintData.image.startsWith("data:") ? complaintData.image : "attachment.jpg"),
      createdAt: new Date().toISOString(),
    };
    db.complaints.unshift(newComplaint);
    db.nextComplaintId += 1;
    saveDB(db);
    return newComplaint;
  }

  // Real API call - uses FormData because an optional file may be attached.
  const payload = new FormData();
  Object.keys(complaintData).forEach((key) => {
    if (complaintData[key] !== undefined && complaintData[key] !== null) {
      payload.append(key, complaintData[key]);
    }
  });
  const response = await axiosInstance.post("/complaints/", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// ---------------- LIST COMPLAINTS (student: own only, admin: all) ----------------
export const getComplaints = async ({ studentId = null } = {}) => {
  if (USE_MOCK) {
    await delay();
    const db = getDB();
    let list = db.complaints;
    if (studentId) list = list.filter((c) => c.studentId === studentId);
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  const params = studentId ? { studentId } : {};
  const response = await axiosInstance.get("/complaints/", { params });
  return response.data;
};

// ---------------- GET SINGLE COMPLAINT ----------------
export const getComplaintById = async (id) => {
  if (USE_MOCK) {
    await delay();
    const db = getDB();
    const complaint = db.complaints.find((c) => String(c.id) === String(id));
    if (!complaint) throw mockError("Complaint not found.");
    // ensure fallback properties
    if (!complaint.trackerStage) {
      complaint.trackerStage = complaint.status === "Resolved" ? "RESOLVED" : complaint.status === "In Progress" ? "IN_PROGRESS" : "SUBMITTED";
    }
    if (!complaint.resolutionOtp) {
      complaint.resolutionOtp = generateOTP();
    }
    if (!complaint.chatMessages) {
      complaint.chatMessages = [];
    }
    if (!complaint.roomInstructions) {
      complaint.roomInstructions = {
        preferredTime: "Anytime",
        keyStatus: "I will be present",
        callBeforeEntry: false,
        notes: "",
      };
    }
    return complaint;
  }
  const response = await axiosInstance.get(`/complaints/${id}/`);
  return response.data;
};

// ---------------- ADMIN: UPDATE STATUS + RESPONSE ----------------
export const updateComplaintStatus = async (id, status, adminResponse) => {
  if (USE_MOCK) {
    await delay();
    const db = getDB();
    const idx = db.complaints.findIndex((c) => String(c.id) === String(id));
    if (idx === -1) throw mockError("Complaint not found.");
    db.complaints[idx].status = status;
    db.complaints[idx].adminResponse = adminResponse;
    if (status === "Resolved") {
      db.complaints[idx].trackerStage = "RESOLVED";
      db.complaints[idx].otpVerified = true;
    } else if (status === "In Progress" && db.complaints[idx].trackerStage === "SUBMITTED") {
      db.complaints[idx].trackerStage = "ASSIGNED";
    }
    saveDB(db);
    return db.complaints[idx];
  }
  const response = await axiosInstance.put(`/complaints/${id}/status/`, {
    status,
    adminResponse,
  });
  return response.data;
};

// ---------------- LIVE TRACKER: UPDATE STAGE & TECHNICIAN ----------------
export const updateTrackerStage = async (id, stage, technician = null) => {
  if (USE_MOCK) {
    await delay(300);
    const db = getDB();
    const idx = db.complaints.findIndex((c) => String(c.id) === String(id));
    if (idx === -1) throw mockError("Complaint not found.");

    db.complaints[idx].trackerStage = stage;
    if (technician) {
      db.complaints[idx].technician = technician;
    }

    // Auto sync status
    if (stage === "RESOLVED") {
      db.complaints[idx].status = "Resolved";
      db.complaints[idx].otpVerified = true;
    } else if (stage === "IN_PROGRESS" || stage === "IN_TRANSIT" || stage === "ASSIGNED") {
      db.complaints[idx].status = "In Progress";
    }

    // Add automated audit log in chat
    if (!db.complaints[idx].chatMessages) db.complaints[idx].chatMessages = [];
    let systemMsg = "";
    if (stage === "ASSIGNED" && technician) {
      systemMsg = `Technician ${technician.name} (${technician.role}) has been assigned. Contact: ${technician.phone}`;
    } else if (stage === "IN_TRANSIT") {
      systemMsg = `Technician is now en route to ${db.complaints[idx].hostelName}, Room ${db.complaints[idx].roomNumber}.`;
    } else if (stage === "IN_PROGRESS") {
      systemMsg = `Repair work is currently in progress.`;
    } else if (stage === "RESOLVED") {
      systemMsg = `Complaint marked as Resolved via OTP Verification.`;
    }

    if (systemMsg) {
      db.complaints[idx].chatMessages.push({
        id: `m-${Date.now()}`,
        sender: "system",
        senderName: "HCMS Tracker",
        text: systemMsg,
        timestamp: new Date().toISOString(),
        isVoiceNote: false,
      });
    }

    saveDB(db);
    return db.complaints[idx];
  }
  const response = await axiosInstance.put(`/complaints/${id}/tracker/`, { stage, technician });
  return response.data;
};

// ---------------- LIVE TRACKER: VERIFY RESOLUTION OTP ----------------
export const verifyResolutionOtp = async (id, enteredOtp) => {
  if (USE_MOCK) {
    await delay(300);
    const db = getDB();
    const idx = db.complaints.findIndex((c) => String(c.id) === String(id));
    if (idx === -1) throw mockError("Complaint not found.");

    const complaint = db.complaints[idx];
    if (String(complaint.resolutionOtp).trim() !== String(enteredOtp).trim()) {
      throw mockError("Invalid OTP! Please ask the student to share their 4-digit verification OTP.");
    }

    complaint.trackerStage = "RESOLVED";
    complaint.status = "Resolved";
    complaint.otpVerified = true;
    if (!complaint.adminResponse) {
      complaint.adminResponse = "Work verified by student via secure OTP and successfully completed.";
    }

    if (!complaint.chatMessages) complaint.chatMessages = [];
    complaint.chatMessages.push({
      id: `m-${Date.now()}`,
      sender: "system",
      senderName: "Security OTP Engine",
      text: `OTP ${enteredOtp} verified successfully. Complaint marked as Resolved.`,
      timestamp: new Date().toISOString(),
      isVoiceNote: false,
    });

    saveDB(db);
    return complaint;
  }
  const response = await axiosInstance.post(`/complaints/${id}/verify-otp/`, { otp: enteredOtp });
  return response.data;
};

// ---------------- CHAT: SEND MESSAGE / VOICE NOTE ----------------
export const sendComplaintMessage = async (id, messageData) => {
  if (USE_MOCK) {
    await delay(200);
    const db = getDB();
    const idx = db.complaints.findIndex((c) => String(c.id) === String(id));
    if (idx === -1) throw mockError("Complaint not found.");

    if (!db.complaints[idx].chatMessages) {
      db.complaints[idx].chatMessages = [];
    }

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: messageData.sender, // 'student' | 'admin'
      senderName: messageData.senderName,
      text: messageData.text || "",
      isVoiceNote: Boolean(messageData.isVoiceNote),
      audioDuration: messageData.audioDuration || "0:10",
      timestamp: new Date().toISOString(),
    };

    db.complaints[idx].chatMessages.push(newMsg);
    saveDB(db);
    return db.complaints[idx];
  }
  const response = await axiosInstance.post(`/complaints/${id}/messages/`, messageData);
  return response.data;
};

// ---------------- ROOM INSTRUCTIONS: UPDATE PREFERENCES ----------------
export const updateRoomInstructions = async (id, roomInstructions) => {
  if (USE_MOCK) {
    await delay(200);
    const db = getDB();
    const idx = db.complaints.findIndex((c) => String(c.id) === String(id));
    if (idx === -1) throw mockError("Complaint not found.");

    db.complaints[idx].roomInstructions = roomInstructions;
    saveDB(db);
    return db.complaints[idx];
  }
  const response = await axiosInstance.put(`/complaints/${id}/instructions/`, roomInstructions);
  return response.data;
};

// ---------------- DASHBOARD STATS ----------------
export const getDashboardStats = async ({ role, studentId = null }) => {
  if (USE_MOCK) {
    await delay();
    const db = getDB();
    const relevant = studentId
      ? db.complaints.filter((c) => c.studentId === studentId)
      : db.complaints;

    const stats = {
      totalComplaints: relevant.length,
      pending: relevant.filter((c) => c.status === "Pending").length,
      inProgress: relevant.filter((c) => c.status === "In Progress").length,
      resolved: relevant.filter((c) => c.status === "Resolved").length,
      rejected: relevant.filter((c) => c.status === "Rejected").length,
    };
    if (role === "admin") {
      stats.totalStudents = db.students.length;
    }
    return stats;
  }
  const response = await axiosInstance.get("/dashboard/");
  return response.data;
};

