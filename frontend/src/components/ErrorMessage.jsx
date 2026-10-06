import React from "react";

// User-friendly error message. We never show raw technical/axios errors to the user.
const ErrorMessage = ({ message = "Something went wrong. Please try again." }) => (
  <div className="alert alert-danger d-flex align-items-center" role="alert">
    <i className="bi bi-exclamation-triangle-fill me-2"></i>
    <div>{message}</div>
  </div>
);

export default ErrorMessage;
