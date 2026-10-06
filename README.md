# 🏢 Hostel Complaint & Mess Management System (HCMS)

A complete, production-grade 3-Tier Full Stack Project built with **React.js**, **Django REST Framework**, and **MySQL**.

---

## 📁 3-Tier Project Architecture

```
hostel-complaint-system/
├── 🌐 frontend/                # React.js UI (Student & Admin Portals, Swiggy Tracker, Mess Matrix)
│   ├── public/
│   ├── src/
│   │   ├── components/         # LiveStatusTracker, ComplaintChat, Badges, Layout, Navbar...
│   │   ├── pages/              # Student & Admin dashboards, MessMatrix, Details...
│   │   ├── services/           # API services & built-in Mock Data Layer
│   │   └── index.css           # Modern CSS tokens, animations & responsive layout
│   └── package.json
│
├── ⚙️ backend/                 # Django REST Framework API Engine
│   ├── hcms_backend/           # Settings, WSGI, ASGI, Root URLs
│   ├── api/                    # Models, DRF Serializers, ViewSets & API Routes
│   ├── manage.py
│   └── requirements.txt
│
└── 🗄️ database/                # MySQL Schema, Seeds & ER Diagrams
    ├── schema.sql              # Clean DDL statements & foreign keys
    ├── seed_data.sql           # Initial dummy students, admins, technicians & mess menu
    ├── hcms_database_dump.sql  # 1-Click ready MySQL dump
    ├── er_diagram.mermaid      # Visual Mermaid entity relationship diagram
    └── README.md
```

---

## 🌟 Advanced & Unique Features Included

1. **🍽️ Mess Food & Hygiene Live Matrix:**
   * Live active meal indicator (Breakfast, Lunch, Snacks, Dinner) with animated status pulse.
   * 4-factor star scoring: Taste, Hygiene, Freshness, and Portion sizes.
   * Interactive issue chips (*Stale Food, Insects, Dirty Utensils, Finished Early*).
   * Photo proof upload and live community review stream.
   * Admin Hygiene Index meter, contractor penalty notices, and weekly menu editor.

2. **🛵 Swiggy-Style Live Status Tracker:**
   * Step progression: `Complaint Filed ➔ Technician Assigned ➔ In-Transit ➔ Fixing in Progress ➔ OTP Verified & Closed`.
   * Technician profile card (Photo, rating, completed jobs, 1-click phone call button).
   * **Secret 4-Digit Resolution OTP:** Student verifies the repair before sharing OTP to prevent fake ticket closures.

3. **💬 In-App Private Chat, Audio Voice Notes & Room Entry Instructions:**
   * Private encrypted chat thread between Student and Maintenance Staff / Warden.
   * Interactive Voice Notes player with animated sound wave bars + Web Audio tone playback + voice recorder.
   * Room entry preference configuration (*Visit slot, key status, call before entry toggle*).
   * 1-Click quick reply chips.

---

## 🚀 How to Run the Project

### Step 1: Run the Frontend (React.js)
```bash
cd frontend
npm install
npm start
```
*Frontend will open at:* `http://localhost:3000/`
*(Note: Ships with demo mock data mode enabled by default in `.env` so you can demo everything immediately!)*

---

### Step 2: Setup Database (MySQL)
```bash
# Using MySQL CLI
mysql -u root -p < database/hcms_database_dump.sql
```
*Or import `database/hcms_database_dump.sql` directly inside phpMyAdmin or MySQL Workbench.*

---

### Step 3: Run the Backend (Django REST Framework)
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver 8000
```
*Backend API will run at:* `http://127.0.0.1:8000/api/`

---

## 🔑 Default Login Credentials

| Role | Email | Password | Access / Room |
|---|---|---|---|
| **Student** | `rohan@example.com` | `password123` | Room A-101 (Ganga Hostel) |
| **Student** | `ananya@example.com` | `password123` | Room B-204 (Yamuna Hostel) |
| **Admin** | `admin@hostel.com` | `admin123` | Full Admin & Warden Access |
