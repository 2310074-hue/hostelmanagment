// ============================================================================
// STUDENT SERVICE
// ----------------------------------------------------------------------------
// Used by the Admin "Manage Students" page.
// Real Django endpoint: GET /api/students/
// ============================================================================
import axiosInstance from "../api/axios";
import { getDB, delay } from "./mockData";

const USE_MOCK = process.env.REACT_APP_USE_MOCK === "true";

export const getAllStudents = async() => {
    if (USE_MOCK) {
        await delay();
        const db = getDB();
        return db.students.map((s) => ({
            ...s,
            registrationDate: s.createdAt || new Date().toISOString(),
            accountStatus: s.status || "Active",
            totalComplaints: db.complaints.filter((c) => c.studentId === s.id).length,
        }));
    }
    const response = await axiosInstance.get("/students/");
    return response.data;
};