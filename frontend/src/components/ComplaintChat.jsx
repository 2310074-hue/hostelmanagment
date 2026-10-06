import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

// Simple Web Audio API sound generator for voice notes simulation
const playSyntheticTone = (durationSeconds = 2) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + durationSeconds);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + durationSeconds);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationSeconds);
  } catch (e) {
    // AudioContext blocked or not supported
  }
};

const ComplaintChat = ({
  complaint,
  role = "student",
  onSendMessage,
  onUpdateInstructions,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState(complaint.chatMessages || []);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  // Room instructions state
  const [instructions, setInstructions] = useState(
    complaint.roomInstructions || {
      preferredTime: "Anytime",
      keyStatus: "I will be present",
      callBeforeEntry: false,
      notes: "",
    }
  );
  const [savingInstructions, setSavingInstructions] = useState(false);
  const [instructionSaved, setInstructionSaved] = useState(false);

  const chatBottomRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setMessages(complaint.chatMessages || []);
    setInstructions(
      complaint.roomInstructions || {
        preferredTime: "Anytime",
        keyStatus: "I will be present",
        callBeforeEntry: false,
        notes: "",
      }
    );
  }, [complaint]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRecordSeconds(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const handleSendText = async (customText = null) => {
    const textToSend = typeof customText === "string" ? customText : inputText;
    if (!textToSend.trim()) return;

    const senderName = role === "student" ? (user?.fullName || "Student") : (user?.fullName || "Hostel Warden / Staff");
    const payload = {
      sender: role,
      senderName,
      text: textToSend.trim(),
      isVoiceNote: false,
    };

    if (onSendMessage) {
      await onSendMessage(payload);
    }
    if (typeof customText !== "string") {
      setInputText("");
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordSeconds(0);
  };

  const stopAndSendVoice = async () => {
    setIsRecording(false);
    const duration = recordSeconds > 0 ? `0:${recordSeconds < 10 ? "0" : ""}${recordSeconds}` : "0:06";
    const senderName = role === "student" ? (user?.fullName || "Student") : (user?.fullName || "Hostel Staff");

    const payload = {
      sender: role,
      senderName,
      text: "🎙️ Voice note recorded for room visit",
      isVoiceNote: true,
      audioDuration: duration,
    };

    if (onSendMessage) {
      await onSendMessage(payload);
    }
  };

  const cancelVoiceRecording = () => {
    setIsRecording(false);
    setRecordSeconds(0);
  };

  const handlePlayVoice = (msgId) => {
    if (playingAudioId === msgId) {
      setPlayingAudioId(null);
      return;
    }
    setPlayingAudioId(msgId);
    playSyntheticTone(3);
    setTimeout(() => {
      setPlayingAudioId(null);
    }, 3000);
  };

  const handleSaveInstructions = async (e) => {
    e.preventDefault();
    setSavingInstructions(true);
    setInstructionSaved(false);
    try {
      if (onUpdateInstructions) {
        await onUpdateInstructions(instructions);
        setInstructionSaved(true);
        setTimeout(() => setInstructionSaved(false), 2500);
      }
    } finally {
      setSavingInstructions(false);
    }
  };

  const quickReplies = role === "student"
    ? [
        "I am present in the room 👍",
        "Please visit after 4 PM ⏰",
        "Please bring spare parts 💡",
        "Roommate is inside the room 🔑",
      ]
    : [
        "Technician dispatched with parts 🛵",
        "Please keep the room open 🚪",
        "Please share OTP after inspection ✅",
        "Issue verified, closing ticket 👍",
      ];

  return (
    <div className="row g-3">
      {/* Left Column: Room Entry Preferences */}
      <div className="col-lg-5">
        <div className="hcms-card p-3 h-100 room-pref-card">
          <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <h6 className="mb-0 fw-bold">
              <i className="bi bi-door-open-fill text-primary me-2"></i>
              Room Entry & Visit Preferences
            </h6>
            <span className="badge bg-light text-dark border">Room #{complaint.roomNumber}</span>
          </div>

          <form onSubmit={handleSaveInstructions}>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Preferred Visit Slot</label>
              <select
                className="form-select form-select-sm"
                value={instructions.preferredTime}
                onChange={(e) => setInstructions({ ...instructions, preferredTime: e.target.value })}
                disabled={role !== "student"}
              >
                <option value="Anytime">Anytime (09:00 AM - 07:00 PM)</option>
                <option value="Morning 09:00 AM - 12:00 PM">Morning (09:00 AM - 12:00 PM)</option>
                <option value="Afternoon 01:00 PM - 04:00 PM">Afternoon (01:00 PM - 04:00 PM)</option>
                <option value="After 4:00 PM">Evening (After 04:00 PM)</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Key & Presence Status</label>
              <select
                className="form-select form-select-sm"
                value={instructions.keyStatus}
                onChange={(e) => setInstructions({ ...instructions, keyStatus: e.target.value })}
                disabled={role !== "student"}
              >
                <option value="I will be present">I will be present in room</option>
                <option value="Roommate inside">Roommate is present in room</option>
                <option value="Key at hostel reception">Key submitted at hostel reception</option>
                <option value="Neighbor has the key">Roommate/Neighbor has the key</option>
              </select>
            </div>

            <div className="mb-3 form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="callBeforeCheck"
                checked={instructions.callBeforeEntry}
                onChange={(e) => setInstructions({ ...instructions, callBeforeEntry: e.target.checked })}
                disabled={role !== "student"}
              />
              <label className="form-check-label small" htmlFor="callBeforeCheck">
                Call 5 minutes before arriving at room
              </label>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Special Entry Notes</label>
              <textarea
                className="form-control form-control-sm"
                rows="2"
                placeholder="e.g. Please knock 3 times, do not ring bell during study hours..."
                value={instructions.notes || ""}
                onChange={(e) => setInstructions({ ...instructions, notes: e.target.value })}
                disabled={role !== "student"}
              ></textarea>
            </div>

            {role === "student" && (
              <div className="d-flex align-items-center justify-content-between">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm px-3"
                  disabled={savingInstructions}
                >
                  {savingInstructions ? "Saving..." : "Save Preferences"}
                </button>
                {instructionSaved && (
                  <span className="text-success small">
                    <i className="bi bi-check-circle-fill me-1"></i> Saved!
                  </span>
                )}
              </div>
            )}
            {role === "admin" && (
              <div className="alert alert-info py-2 px-3 small mb-0">
                <i className="bi bi-info-circle me-1"></i> Student configured preferences for technician visit.
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Right Column: Interactive Chat & Voice Notes */}
      <div className="col-lg-7">
        <div className="hcms-card p-0 d-flex flex-column chat-container-card">
          {/* Chat Header */}
          <div className="chat-header p-3 border-bottom d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div className="chat-status-dot"></div>
              <div>
                <h6 className="mb-0 fw-bold">Private Support Channel</h6>
                <small className="text-muted">
                  {role === "student" ? "Direct link to Maintenance Staff & Admin" : `Chat with ${complaint.studentName}`}
                </small>
              </div>
            </div>
            <span className="badge bg-secondary-subtle text-secondary border">Encrypted</span>
          </div>

          {/* Chat Message Thread */}
          <div className="chat-body p-3 flex-grow-1 overflow-auto" style={{ maxHeight: "360px", minHeight: "260px" }}>
            {messages.length === 0 ? (
              <div className="text-center text-muted py-4 small">
                <i className="bi bi-chat-dots fs-3 d-block mb-1 opacity-50"></i>
                No messages yet. Send a message or voice note to coordinate the repair.
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender === role;
                const isSystem = msg.sender === "system";

                if (isSystem) {
                  return (
                    <div key={msg.id} className="text-center my-2">
                      <span className="badge bg-light text-muted border px-3 py-1 font-monospace small">
                        <i className="bi bi-gear-fill me-1 text-primary"></i> {msg.text}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`d-flex mb-3 ${isMe ? "justify-content-end" : "justify-content-start"}`}
                  >
                    <div className={`chat-bubble ${isMe ? "bubble-mine" : "bubble-other"}`}>
                      <div className="d-flex justify-content-between align-items-center gap-2 mb-1">
                        <span className="bubble-sender fw-bold small">{msg.senderName}</span>
                        <span className="bubble-time small">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      {msg.isVoiceNote ? (
                        /* Voice Note Bubble with Audio Waveform */
                        <div className="voice-note-player d-flex align-items-center gap-2 mt-1">
                          <button
                            type="button"
                            className="btn btn-sm voice-play-btn"
                            onClick={() => handlePlayVoice(msg.id)}
                          >
                            <i className={`bi ${playingAudioId === msg.id ? "bi-pause-fill" : "bi-play-fill"}`}></i>
                          </button>
                          <div className={`waveform-visualizer ${playingAudioId === msg.id ? "playing" : ""}`}>
                            <span className="wave-bar"></span>
                            <span className="wave-bar"></span>
                            <span className="wave-bar"></span>
                            <span className="wave-bar"></span>
                            <span className="wave-bar"></span>
                            <span className="wave-bar"></span>
                            <span className="wave-bar"></span>
                          </div>
                          <span className="voice-duration small fw-bold">{msg.audioDuration || "0:12"}</span>
                        </div>
                      ) : (
                        <p className="bubble-text mb-0">{msg.text}</p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-3 pt-2 pb-1 bg-light border-top quick-chips-container d-flex gap-1 overflow-auto">
            {quickReplies.map((qr, idx) => (
              <button
                key={idx}
                type="button"
                className="btn btn-xs btn-outline-secondary text-nowrap rounded-pill py-0 px-2 small"
                style={{ fontSize: "0.75rem" }}
                onClick={() => handleSendText(qr)}
              >
                {qr}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="chat-footer p-2 border-top bg-white">
            {isRecording ? (
              <div className="d-flex align-items-center justify-content-between p-2 bg-danger-subtle rounded-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="recording-blink-dot"></span>
                  <span className="fw-bold text-danger small">
                    Recording Audio... 0:{recordSeconds < 10 ? "0" : ""}{recordSeconds}
                  </span>
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={cancelVoiceRecording}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger px-3"
                    onClick={stopAndSendVoice}
                  >
                    <i className="bi bi-send-fill me-1"></i> Send Voice
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendText();
                }}
                className="d-flex align-items-center gap-2"
              >
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm rounded-circle voice-record-btn"
                  title="Record Voice Note"
                  onClick={startVoiceRecording}
                >
                  <i className="bi bi-mic-fill text-danger"></i>
                </button>

                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Type a message or instruction..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />

                <button
                  type="submit"
                  className="btn btn-primary btn-sm px-3"
                  disabled={!inputText.trim()}
                >
                  <i className="bi bi-send-fill"></i>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintChat;
