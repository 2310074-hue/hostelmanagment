import axiosInstance from "../api/axios";
import { getDB, saveDB, delay } from "./mockData";
import { mockError } from "./mockError";

const USE_MOCK = process.env.REACT_APP_USE_MOCK === "true";

export const getAdmins = async() => {
    if (USE_MOCK) {
        await delay();
        const db = getDB();
        return db.admins.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    const response = await axiosInstance.get("/admin/admins/");
    return response.data;
};

export const createAdmin = async(adminData) => {
    if (USE_MOCK) {
        await delay();
        const db = getDB();
        const exists = db.admins.some((admin) => admin.email === adminData.email);
        if (exists) {
            throw mockError("An admin with this email already exists.");
        }
        const newAdmin = {
            id: db.nextAdminId,
            fullName: adminData.fullName,
            email: adminData.email,
            password: adminData.password,
            status: "Active",
            createdAt: new Date().toISOString(),
        };
        db.admins.push(newAdmin);
        db.nextAdminId += 1;
        saveDB(db);
        return newAdmin;
    }
    const response = await axiosInstance.post("/admin/admins/create/", adminData);
    return response.data;
};

export const updateAdmin = async(id, updateData) => {
    if (USE_MOCK) {
        await delay();
        const db = getDB();
        const index = db.admins.findIndex((admin) => String(admin.id) === String(id));
        if (index === -1) throw mockError("Admin not found.");
        db.admins[index] = {...db.admins[index], ...updateData };
        saveDB(db);
        return db.admins[index];
    }
    const response = await axiosInstance.put(`/admin/admins/${id}/`, updateData);
    return response.data;
};

export const deleteAdmin = async(id) => {
    if (USE_MOCK) {
        await delay();
        const db = getDB();
        const index = db.admins.findIndex((admin) => String(admin.id) === String(id));
        if (index === -1) throw mockError("Admin not found.");
        db.admins.splice(index, 1);
        saveDB(db);
        return { success: true };
    }
    const response = await axiosInstance.delete(`/admin/admins/${id}/`);
    return response.data;
};