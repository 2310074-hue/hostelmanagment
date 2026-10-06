# Database Setup Guide (MySQL / MariaDB)

This directory contains the database scripts for the **Hostel Complaint Management System (HCMS)**.

## 📁 Files in this Folder

| File | Purpose |
|---|---|
| `schema.sql` | Complete DDL script (tables, foreign keys, indexes). |
| `seed_data.sql` | Sample students, admins, technicians, complaints, 7-day mess menu, and reviews. |
| `hcms_database_dump.sql` | All-in-one single file (schema + seed data) for instant import. |
| `er_diagram.mermaid` | Mermaid ER diagram of the complete database schema. |

---

## 🚀 Quick Setup Instructions

### Option A: Using MySQL Command Line (CLI)

```bash
# 1. Login to MySQL
mysql -u root -p

# 2. Import the complete database dump
source /path/to/database/hcms_database_dump.sql;
```

Or in one command from your terminal:
```bash
mysql -u root -p < database/hcms_database_dump.sql
```

---

### Option B: Using phpMyAdmin (XAMPP / WAMP)

1. Open **phpMyAdmin** in your browser (`http://localhost/phpmyadmin`).
2. Click on the **"Import"** tab in top navigation.
3. Click **"Choose File"** and select `hcms_database_dump.sql`.
4. Click **"Go"** at the bottom.
5. Database `hcms_db` will be created with all tables and sample records.

---

### Option C: Using MySQL Workbench

1. Open MySQL Workbench and connect to your local MySQL server.
2. Go to **File -> Open SQL Script...** and select `hcms_database_dump.sql`.
3. Click the ⚡ **Execute** icon (or press `Ctrl + Shift + Enter`).

---

## 🔑 Default Seed Credentials

| Role | Email | Password | Details |
|---|---|---|---|
| **Student** | `rohan@example.com` | `password123` | Room A-101 (Ganga Hostel) |
| **Student** | `ananya@example.com` | `password123` | Room B-204 (Yamuna Hostel) |
| **Admin** | `admin@hostel.com` | `admin123` | Chief Warden / Super Admin |
