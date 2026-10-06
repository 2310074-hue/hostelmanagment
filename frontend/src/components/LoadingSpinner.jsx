import React from "react";

// Reusable loading indicator shown while an API request is in progress.
const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5">
    <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="text-muted mt-3 mb-0">{text}</p>
  </div>
);

export default LoadingSpinner;
