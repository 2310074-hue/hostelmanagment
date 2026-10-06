import React from "react";

const SuccessMessage = ({ message }) => (
  <div className="alert alert-success d-flex align-items-center" role="alert">
    <i className="bi bi-check-circle-fill me-2"></i>
    <div>{message}</div>
  </div>
);

export default SuccessMessage;
