import axiosInstance from "../api/axios";
import { getDB, delay } from "./mockData";

const USE_MOCK = process.env.REACT_APP_USE_MOCK === "true";

export const getAllUsers = async() => {
    if (USE_MOCK) {
        await delay();
        const db = getDB();
        return db.students.map((student) => ({
            ...student,
            registrationDate: student.createdAt || new Date().toISOString(),
            accountStatus: student.status || "Active",
            totalComplaints: db.complaints.filter((c) => c.studentId === student.id).length,
        }));
    }
    const response = await axiosInstance.get("/students/");
    return response.data;
};