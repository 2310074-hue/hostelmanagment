# Hostel Complaint Management System (HCMS)

A complete React.js frontend for a college **Full Stack / Front-End Web Technology** project.
Two roles — **Student** and **Admin** — with separate logins, dashboards, and permissions.
Built to plug into a **Django REST Framework + MySQL** backend, but ships with a **mock data
layer** so you can run and demo the whole app right now, with no backend at all.

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| UI Library | React.js (functional components + Hooks) |
| Routing | React Router DOM v6 |
| HTTP Client | Axios |
| Styling | Bootstrap 5 + Bootstrap Icons + small custom CSS |
| State/Auth | React Context API (`AuthContext`) |
| Backend (to connect) | Django REST Framework |
| Database (via Django) | MySQL |
| Demo mode | Local mock service layer (localStorage) — **no Firebase used anywhere** |

---

## 2. Project Creation Commands (how this was scaffolded)

```bash
npx create-react-app hostel-complaint-system
cd hostel-complaint-system
npm install axios bootstrap bootstrap-icons react-bootstrap react-router-dom
```

You don't need to redo this — the project is already fully created below. Just install and run (Section 4).

---

## 3. Complete Folder Structure

```
hostel-complaint-system/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── axios.js                 # Axios instance + interceptors (token attach, 401 handling)
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Layout.jsx                # Sidebar + Navbar + content wrapper (used by every page)
│   │   ├── StudentSidebar.jsx
│   │   ├── AdminSidebar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── DashboardCard.jsx
│   │   ├── ComplaintCard.jsx
│   │   ├── ComplaintTable.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── PriorityBadge.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── SuccessMessage.jsx
│   │   ├── Modal.jsx
│   │   ├── SearchBar.jsx
│   │   └── FilterDropdown.jsx
│   ├── pages/
│   │   ├── Login.jsx                 # Student login
│   │   ├── Register.jsx              # Student registration
│   │   ├── NotFound.jsx
│   │   ├── student/
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── SubmitComplaint.jsx
│   │   │   ├── MyComplaints.jsx
│   │   │   ├── ComplaintDetails.jsx
│   │   │   └── StudentProfile.jsx
│   │   └── admin/
│   │       ├── AdminLogin.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── ManageComplaints.jsx
│   │       ├── AdminComplaintDetails.jsx
│   │       ├── ManageStudents.jsx
│   │       └── AdminProfile.jsx
│   ├── services/
│   │   ├── authService.js            # register / login / admin login
│   │   ├── complaintService.js       # submit / list / get / update-status / dashboard stats
│   │   ├── studentService.js         # list all students (admin)
│   │   ├── mockData.js               # localStorage "fake database" + seed data
│   │   └── mockError.js              # helper to shape mock errors like Axios errors
│   ├── context/
│   │   └── AuthContext.jsx           # login/logout state, shared via useContext
│   ├── utils/
│   │   └── constants.js              # categories, priorities, statuses, storage keys
│   ├── App.jsx                       # All routing lives here (kept out of index.js)
│   ├── index.js                      # React entry point (loads Bootstrap CSS)
│   └── index.css                     # Custom design tokens / theme on top of Bootstrap
├── .env                              # REACT_APP_API_URL, REACT_APP_USE_MOCK
├── .env.example
└── package.json
```

---

## 4. How to Run the Project

```bash
cd hostel-complaint-system
npm install
npm start
```

The app opens at **http://localhost:3000** and redirects to `/login`.

### Demo credentials (mock mode)
| Role | Email | Password |
|---|---|---|
| Student | rohan@example.com | password123 |
| Student | ananya@example.com | password123 |
| Admin | admin@hostel.com | admin123 |

By default `REACT_APP_USE_MOCK=true` in `.env`, so **everything works immediately** —
registration, login, submitting complaints, admin status updates — all persisted in the
browser's `localStorage` (acting as a fake database). This is exactly what "Requirement 5:
create a temporary mock API/service layer" asked for.

---

## 5. How to Connect It to Your Django Backend

1. Build a Django REST Framework project with these endpoints (matching what the frontend already calls):

   ```
   POST /api/register/
   POST /api/login/
   POST /api/admin/login/
   GET  /api/complaints/            (student: own complaints, admin: all complaints)
   POST /api/complaints/
   GET  /api/complaints/:id/
   PUT  /api/complaints/:id/
   PUT  /api/complaints/:id/status/
   GET  /api/students/
   GET  /api/dashboard/
   ```

2. Enable CORS in Django (`django-cors-headers`) so React (port 3000) can call Django (port 8000).

3. Update `.env`:
   ```
   REACT_APP_API_URL=http://127.0.0.1:8000/api
   REACT_APP_USE_MOCK=false
   ```

4. Restart `npm start`. Every function in `src/services/*.js` already has a real
   `axiosInstance.get/post/put(...)` call written right next to the mock version — flipping
   `REACT_APP_USE_MOCK` to `false` switches every screen over to the real API with **zero
   changes to any page/component**. That's the whole point of the services layer.

5. Login responses from Django should be shaped like:
   ```json
   {
     "token": "xxxxx",
     "role": "student",
     "user": { "id": 1, "fullName": "...", "email": "...", "studentId": "...", ... }
   }
   ```
   This is exactly what `AuthContext.login()` expects.

6. Token is attached automatically to every request via the Axios interceptor in
   `src/api/axios.js` (`Authorization: Bearer <token>` — change to `Token <token>` if you use
   DRF's default `TokenAuthentication`).

7. MySQL sits behind Django: create Django models for `Student`, `Admin`, `Complaint`
   (fields matching the mock data shape in `services/mockData.js`), run
   `python manage.py makemigrations && migrate`, and Django's ORM handles all MySQL reads/writes.
   React never talks to MySQL directly — only ever through the Django REST API.

---

## 6. Feature Checklist (what's implemented)

- Student registration & login, Admin login (separate page/route)
- Auth persisted via Context + localStorage, session survives refresh, logout clears it
- Protected routes — students can't open `/admin/*`, admins can't open `/student/*`
- Student dashboard with live stats (total / pending / in progress / resolved)
- Submit Complaint form: title, category, description, hostel, room, priority, optional file, full validation
- My Complaints: table view + card view toggle, responsive
- Complaint Details with a visual status timeline (Submitted → Pending → In Progress → Resolved, with a Rejected state)
- Admin dashboard with 6 stat cards + recent complaints table
- Manage Complaints: search (ID/student/category/room/title) + filter by status/category/priority
- Admin can update status and write a response, sent to the API via `PUT /complaints/:id/status/`
- Manage Students: searchable list with per-student complaint counts
- Reusable component library (badges, cards, tables, modal, spinner, alerts, search, filters)
- Loading spinners and friendly error/success messages everywhere API calls happen
- Fully responsive (Bootstrap grid + a collapsible sidebar on mobile)

---

## 7. Viva / Exam Explanation Guide

**1. What is React?**
A JavaScript library for building user interfaces using reusable components and a virtual DOM for efficient updates.

**2. Why React is used?**
Component reusability, faster UI updates (virtual DOM), huge ecosystem, easy to combine with any backend (here, Django REST API).

**3. What are components?**
Independent, reusable pieces of UI. E.g. `StatusBadge.jsx`, `DashboardCard.jsx` — each does one small job and is reused everywhere it's needed.

**4. What are props?**
Data passed *into* a component from its parent, read-only inside the component. E.g. `<StatusBadge status={complaint.status} />` — `status` is a prop.

**5. What are states?**
Data that belongs to a component and can change over time, triggering a re-render when updated. E.g. `const [complaints, setComplaints] = useState([])` in `MyComplaints.jsx`.

**6. What are React Hooks?**
Functions that let functional components use state/lifecycle features without writing class components — `useState`, `useEffect`, `useContext` are used throughout this project.

**7. What is `useState`?**
A Hook that adds a state variable to a component, e.g. form fields in `Login.jsx`, or `loading`/`error` flags on every page that calls the API.

**8. What is `useEffect`?**
A Hook that runs side effects (like API calls) after render — e.g. in `StudentDashboard.jsx`, `useEffect` fetches dashboard stats when the component mounts.

**9. What is React Router?**
A library that maps URL paths to components without reloading the page, e.g. `/student/dashboard` → `StudentDashboard`, defined centrally in `App.jsx`.

**10. What is Axios?**
A promise-based HTTP client used to call the Django REST API from React — configured once in `src/api/axios.js` with a base URL and an auth-token interceptor.

**11. How does React communicate with Django?**
React (frontend) sends HTTP requests (GET/POST/PUT) to Django REST Framework endpoints using Axios; Django processes them, talks to MySQL, and returns JSON, which React uses to update the UI.

**12. What is a REST API?**
An architecture where the server exposes resources (like `/complaints/`) that clients access via standard HTTP methods (GET, POST, PUT, DELETE), typically exchanging JSON.

**13. What is authentication?**
The process of verifying who a user is (login) and proving it on later requests using a token, which is stored client-side and attached to every request's headers.

**14. What is a protected route?**
A route that only renders its page if the user is logged in (and has the right role) — implemented in `ProtectedRoute.jsx`, redirecting unauthorized users to the correct login page.

**15. How does student login work?**
Student submits email/password → `authService.loginStudent()` calls the API (or mock) → on success, `AuthContext.login()` stores the token, role, and user in state + localStorage → user is redirected to `/student/dashboard`, which is now accessible because `ProtectedRoute` sees a valid `student` session.

**16. How does complaint submission work?**
Student fills the form in `SubmitComplaint.jsx` → client-side validation runs → `complaintService.submitComplaint()` sends the data (as `FormData`, to support the optional file) via Axios `POST /api/complaints/` → Django saves it to MySQL with status `Pending` → success message shown → redirected to My Complaints.

**17. How does admin change complaint status?**
Admin opens a complaint in `AdminComplaintDetails.jsx`, picks a new status and writes a response → `complaintService.updateComplaintStatus()` sends `PUT /api/complaints/:id/status/` → Django updates the MySQL row → the updated complaint (with new status/response) is shown immediately.

**18. How is data stored in MySQL?**
React never touches MySQL directly. Django models (e.g. `Student`, `Complaint`) are defined with fields, Django's ORM translates them into MySQL tables via migrations, and every Axios call from React ultimately becomes a Django view that reads/writes rows through that ORM.

---

## 8. Notes

- No Firebase is used anywhere — auth/session state uses React Context + localStorage, and data persistence is designed around Django + MySQL.
- The mock layer (`services/mockData.js`) is a drop-in stand-in only; every real endpoint call is already written beside it in the same service file, so removing the mock later is a one-line `.env` change, not a rewrite.
