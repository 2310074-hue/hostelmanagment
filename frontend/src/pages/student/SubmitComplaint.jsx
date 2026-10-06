import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { submitComplaint } from "../../services/complaintService";
import { COMPLAINT_CATEGORIES, PRIORITY_LEVELS } from "../../utils/constants";
import ErrorMessage from "../../components/ErrorMessage";
import SuccessMessage from "../../components/SuccessMessage";

const SubmitComplaint = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: COMPLAINT_CATEGORIES[0],
    description: "",
    hostelName: user?.hostelName || "",
    roomNumber: user?.roomNumber || "",
    priority: "Medium",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (< 5MB for localStorage safety)
      if (file.size > 5 * 1024 * 1024) {
        setApiError("Image size is too large. Please select an image under 5MB.");
        return;
      }
      setApiError("");
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      removeImage();
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageName("");
    setForm((prev) => ({ ...prev, image: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Complaint title is required.";
    if (!form.description.trim()) errs.description = "Description is required.";
    if (!form.hostelName.trim()) errs.hostelName = "Hostel name is required.";
    if (!form.roomNumber.trim()) errs.roomNumber = "Room number is required.";
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
      await submitComplaint({ ...form, imageName: imageName || form.image?.name || null }, user);
      setSuccess("Complaint submitted successfully!");
      setTimeout(() => navigate("/student/complaints"), 1200);
    } catch (err) {
      setApiError(err?.response?.data?.message || "Unable to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout role="student" title="Submit Complaint">
      <div className="hcms-card p-4" style={{ maxWidth: 800 }}>
        <h5 className="mb-3">New Complaint</h5>

        {apiError && <ErrorMessage message={apiError} />}
        {success && <SuccessMessage message={success} />}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Complaint Title</label>
            <input
              type="text" name="title"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              value={form.title} onChange={handleChange}
              placeholder="E.g. Fan not working"
            />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Category</label>
              <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                {COMPLAINT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Priority</label>
              <select name="priority" className="form-select" value={form.priority} onChange={handleChange}>
                {PRIORITY_LEVELS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description" rows="4"
              className={`form-control ${errors.description ? "is-invalid" : ""}`}
              value={form.description} onChange={handleChange}
              placeholder="Describe the issue in detail..."
            />
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Hostel Name</label>
              <input
                type="text" name="hostelName"
                className={`form-control ${errors.hostelName ? "is-invalid" : ""}`}
                value={form.hostelName} onChange={handleChange}
              />
              {errors.hostelName && <div className="invalid-feedback">{errors.hostelName}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Room Number</label>
              <input
                type="text" name="roomNumber"
                className={`form-control ${errors.roomNumber ? "is-invalid" : ""}`}
                value={form.roomNumber} onChange={handleChange}
              />
              {errors.roomNumber && <div className="invalid-feedback">{errors.roomNumber}</div>}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Attach Image/Photo (optional)</label>
            <input 
              type="file" 
              className="form-control" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            {imagePreview && (
              <div className="mt-3 p-2 border rounded bg-light d-flex align-items-center gap-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "6px", border: "1px solid #ced4da" }}
                />
                <div className="flex-grow-1 overflow-hidden">
                  <div className="fw-semibold small text-truncate">{imageName}</div>
                  <span className="badge bg-success-subtle text-success border border-success-subtle mt-1">Ready to upload</span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={removeImage}
                >
                  <i className="bi bi-trash"></i> Remove
                </button>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default SubmitComplaint;
