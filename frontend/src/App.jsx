import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public / auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import SubmitComplaint from "./pages/student/SubmitComplaint";
import MyComplaints from "./pages/student/MyComplaints";
import ComplaintDetails from "./pages/student/ComplaintDetails";
import StudentProfile from "./pages/student/StudentProfile";
import MessMatrix from "./pages/student/MessMatrix";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageAdmins from "./pages/admin/ManageAdmins";
import ManageComplaints from "./pages/admin/ManageComplaints";
import AdminComplaintDetails from "./pages/admin/AdminComplaintDetails";
import ManageStudents from "./pages/admin/ManageStudents";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminMessMatrix from "./pages/admin/AdminMessMatrix";

// App.jsx only wires up routing - all actual page logic lives in /pages.
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public / Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Student routes - protected, only role "student" can access */}
          <Route
            path="/student/dashboard"
            element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>}
          />
          <Route
            path="/student/submit-complaint"
            element={<ProtectedRoute allowedRole="student"><SubmitComplaint /></ProtectedRoute>}
          />
          <Route
            path="/student/complaints"
            element={<ProtectedRoute allowedRole="student"><MyComplaints /></ProtectedRoute>}
          />
          <Route
            path="/student/complaints/:id"
            element={<ProtectedRoute allowedRole="student"><ComplaintDetails /></ProtectedRoute>}
          />
          <Route
            path="/student/mess-matrix"
            element={<ProtectedRoute allowedRole="student"><MessMatrix /></ProtectedRoute>}
          />
          <Route
            path="/student/profile"
            element={<ProtectedRoute allowedRole="student"><StudentProfile /></ProtectedRoute>}
          />

          {/* Admin routes - protected, only role "admin" can access */}
          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin/complaints"
            element={<ProtectedRoute allowedRole="admin"><ManageComplaints /></ProtectedRoute>}
          />
          <Route
            path="/admin/complaints/:id"
            element={<ProtectedRoute allowedRole="admin"><AdminComplaintDetails /></ProtectedRoute>}
          />
          <Route
            path="/admin/mess-matrix"
            element={<ProtectedRoute allowedRole="admin"><AdminMessMatrix /></ProtectedRoute>}
          />
          <Route
            path="/admin/admins"
            element={<ProtectedRoute allowedRole="admin"><ManageAdmins /></ProtectedRoute>}
          />
          <Route
            path="/admin/students"
            element={<ProtectedRoute allowedRole="admin"><ManageStudents /></ProtectedRoute>}
          />
          <Route
            path="/admin/profile"
            element={<ProtectedRoute allowedRole="admin"><AdminProfile /></ProtectedRoute>}
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

