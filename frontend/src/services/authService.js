// ============================================================================
// AUTH SERVICE
// ----------------------------------------------------------------------------
// Handles registration/login for both students and admins.
// When REACT_APP_USE_MOCK=true it talks to the local mock database.
// When REACT_APP_USE_MOCK=false it calls the real Django REST endpoints:
//   POST /api/register/
//   POST /api/login/
//   POST /api/admin/login/
// ============================================================================
import axiosInstance from "../api/axios";
import { getDB, saveDB, delay } from "./mockData";
import { mockError } from "./mockError";

const USE_MOCK = process.env.REACT_APP_USE_MOCK === "true";

const fakeToken = (prefix) => `${prefix}-${Math.random().toString(36).slice(2)}-${Date.now()}`;

// ---------------- STUDENT REGISTER ----------------
export const registerStudent = async (formData) => {
  if (USE_MOCK) {
    await delay();
    const db = getDB();
    const emailExists = db.students.some((s) => s.email === formData.email);
    if (emailExists) {
      throw mockError("Email is already registered.");
    }
    const newStudent = {
      id: db.nextStudentId,
      studentId: formData.studentId,
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      mobile: formData.mobile,
      hostelName: formData.hostelName,
      roomNumber: formData.roomNumber,
    };
    db.students.push(newStudent);
    db.nextStudentId += 1;
    saveDB(db);
    return { message: "Registration successful." };
  }
  const response = await axiosInstance.post("/register/", formData);
  return response.data;
};

// ---------------- STUDENT LOGIN ----------------
export const loginStudent = async (email, password) => {
  if (USE_MOCK) {
    await delay();
    const db = getDB();
    const student = db.students.find((s) => s.email === email && s.password === password);
    if (!student) {
      throw mockError("Invalid email or password.");
    }
    return {
      token: fakeToken("student"),
      role: "student",
      user: {
        id: student.id,
        studentId: student.studentId,
        fullName: student.fullName,
        email: student.email,
        mobile: student.mobile,
        hostelName: student.hostelName,
        roomNumber: student.roomNumber,
      },
    };
  }
  const response = await axiosInstance.post("/login/", { email, password });
  return response.data;
};

// ---------------- ADMIN LOGIN ----------------
export const loginAdmin = async (email, password) => {
  if (USE_MOCK) {
    await delay();
    const db = getDB();
    const admin = db.admins.find((a) => a.email === email && a.password === password);
    if (!admin) {
      throw mockError("Invalid admin credentials.");
    }
    return {
      token: fakeToken("admin"),
      role: "admin",
      user: { id: admin.id, fullName: admin.fullName, email: admin.email },
    };
  }
  const response = await axiosInstance.post("/admin/login/", { email, password });
  return response.data;
};
