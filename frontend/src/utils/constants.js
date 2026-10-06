// Centralised constants used across the app.
// Keeping these in one place makes the project easier to maintain and explain in a viva.

export const COMPLAINT_CATEGORIES = [
  "Electricity",
  "Water",
  "Cleaning",
  "Food",
  "Maintenance",
  "Wi-Fi",
  "Security",
  "Other",
];

export const PRIORITY_LEVELS = ["Low", "Medium", "High"];

export const COMPLAINT_STATUSES = [
  "Pending",
  "In Progress",
  "Resolved",
  "Rejected",
];

// Swiggy-Style Live Status Tracker Stages
export const TRACKER_STAGES = [
  {
    key: "SUBMITTED",
    label: "Complaint Filed",
    icon: "bi-file-earmark-check",
    description: "Ticket registered & assigned ticket ID",
  },
  {
    key: "ASSIGNED",
    label: "Technician Assigned",
    icon: "bi-person-check",
    description: "Specialist assigned to your hostel wing",
  },
  {
    key: "IN_TRANSIT",
    label: "En Route / In Transit",
    icon: "bi-bicycle",
    description: "Technician is heading to your room",
  },
  {
    key: "IN_PROGRESS",
    label: "Fixing in Progress",
    icon: "bi-tools",
    description: "Repair & inspection currently underway",
  },
  {
    key: "RESOLVED",
    label: "OTP Verified & Closed",
    icon: "bi-shield-fill-check",
    description: "Student inspected & verified with secure OTP",
  },
];

// Sample Technicians database
export const SAMPLE_TECHNICIANS = [
  {
    id: "TECH-101",
    name: "Rameshwar Sharma",
    role: "Chief Electrician",
    phone: "+91 98765-43210",
    rating: 4.9,
    jobsCompleted: 142,
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120&auto=format&fit=crop&q=80",
    specialty: "Fans, Wiring & MCBs",
  },
  {
    id: "TECH-102",
    name: "Mukesh Kumar",
    role: "Master Plumber",
    phone: "+91 98765-11223",
    rating: 4.8,
    jobsCompleted: 98,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    specialty: "Pipe Leaks, Taps & Flush",
  },
  {
    id: "TECH-103",
    name: "Imran Khan",
    role: "Network Engineer",
    phone: "+91 98765-77889",
    rating: 4.7,
    jobsCompleted: 76,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    specialty: "Wi-Fi APs, LAN & Switches",
  },
  {
    id: "TECH-104",
    name: "Suresh Carpenter",
    role: "Furniture & Lock Specialist",
    phone: "+91 98765-99001",
    rating: 4.8,
    jobsCompleted: 115,
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80",
    specialty: "Door Locks, Almirah & Beds",
  },
];

// Mess Meals & Timetable
export const MESS_MEALS = [
  {
    id: "breakfast",
    name: "Breakfast",
    time: "07:30 AM - 09:30 AM",
    icon: "bi-cup-hot-fill",
    badgeColor: "warning",
  },
  {
    id: "lunch",
    name: "Lunch",
    time: "12:30 PM - 02:30 PM",
    icon: "bi-sun-fill",
    badgeColor: "success",
  },
  {
    id: "snacks",
    name: "Evening Snacks",
    time: "05:00 PM - 06:15 PM",
    icon: "bi-cup-straw",
    badgeColor: "info",
  },
  {
    id: "dinner",
    name: "Dinner",
    time: "08:00 PM - 10:00 PM",
    icon: "bi-moon-stars-fill",
    badgeColor: "primary",
  },
];

// Mess Issue Tags
export const MESS_ISSUE_TAGS = [
  "Stale / Cold Food",
  "Foreign Object / Insects",
  "Unhygienic Utensils / Spoons",
  "Excess Salt / Oil",
  "Under-Cooked / Raw",
  "Food Finished Too Early",
  "Rude Mess Staff",
  "Drinking Water Issue",
];

// Local storage keys used for storing the auth token / user info on the client.
export const STORAGE_KEYS = {
  TOKEN: "hcms_token",
  USER: "hcms_user",
  ROLE: "hcms_role",
};

export const ROLES = {
  STUDENT: "student",
  ADMIN: "admin",
};

