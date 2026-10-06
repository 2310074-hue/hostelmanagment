# HCMS Backend (Django REST Framework)

This is the backend API service for the **Hostel Complaint Management System (HCMS)** built with Python, Django REST Framework, and MySQL.

---

## 🛠️ Tech Stack

- **Framework:** Django 4.2+ & Django REST Framework (DRF)
- **Database:** MySQL 8.0+ / SQLite fallback
- **Authentication:** REST Token / Session
- **CORS Support:** `django-cors-headers`

---

## 🚀 How to Run the Backend

### 1. Create a Virtual Environment & Install Dependencies

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# Install required Python packages
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```
Ensure your MySQL credentials match in `.env` (Database `hcms_db` should be created using scripts in `/database/`).

### 3. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Start the Django Development Server

```bash
python manage.py runserver 8000
```

Backend will start at: `http://127.0.0.1:8000/`

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register/` | Register new student |
| `POST` | `/api/auth/login/` | Student login |
| `POST` | `/api/auth/admin/login/` | Admin login |
| `GET/POST` | `/api/complaints/` | List complaints / Create new complaint |
| `GET` | `/api/complaints/:id/` | Retrieve complaint details + chat messages |
| `PUT` | `/api/complaints/:id/status/` | Admin update status & response |
| `PUT` | `/api/complaints/:id/tracker/` | Update Swiggy tracker stage & assign technician |
| `POST` | `/api/complaints/:id/verify-otp/` | Student OTP verification for closure |
| `POST` | `/api/complaints/:id/messages/` | Send private chat message or voice note |
| `PUT` | `/api/complaints/:id/instructions/` | Update room visit instructions |
| `GET` | `/api/mess/menu/` | 7-day cyclic mess menu |
| `GET/POST` | `/api/mess/reviews/` | List / Submit daily meal hygiene reviews |
| `GET` | `/api/mess/stats/` | Hygiene Index, satisfaction scores & audit metrics |
| `POST` | `/api/mess/actions/` | Issue official contractor penalty/warning notice |
| `GET` | `/api/dashboard/` | Dashboard statistics (counts, statuses) |
| `GET` | `/api/students/` | Admin list of all registered students |
