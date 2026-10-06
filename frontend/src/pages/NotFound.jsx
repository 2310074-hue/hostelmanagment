import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
    <h1 className="display-1 text-primary">404</h1>
    <p className="text-muted mb-3">The page you're looking for doesn't exist.</p>
    <Link to="/login" className="btn btn-primary">Go to Login</Link>
  </div>
);

export default NotFound;
