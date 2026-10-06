// ============================================================================
// MOCK DATA LAYER
// ----------------------------------------------------------------------------
// This file simulates a Django REST API + MySQL database using the browser's
// localStorage, so the whole UI can be demonstrated before the real Django
// backend is connected. It is used ONLY when REACT_APP_USE_MOCK=true.
// ============================================================================

import { SAMPLE_TECHNICIANS } from "../utils/constants";

const DB_KEY = "hcms_mock_db_v2"; // upgraded version key for seamless auto-migration

const seedDatabase = () => {
  const seed = {
    students: [
      {
        id: 1,
        studentId: "STU1001",
        fullName: "Rohan Deshmukh",
        email: "rohan@example.com",
        password: "password123",
        mobile: "9876543210",
        hostelName: "Ganga Hostel",
        roomNumber: "A-101",
      },
      {
        id: 2,
        studentId: "STU1002",
        fullName: "Ananya Sharma",
        email: "ananya@example.com",
        password: "password123",
        mobile: "9876501234",
        hostelName: "Yamuna Hostel",
        roomNumber: "B-204",
      },
    ],
    admins: [
      {
        id: 1,
        fullName: "Admin User",
        email: "admin@hostel.com",
        password: "admin123",
        status: "Active",
        createdAt: "2026-08-01T09:00:00Z",
      },
    ],
    complaints: [
      {
        id: 101,
        studentId: 1,
        studentName: "Rohan Deshmukh",
        title: "Fan not working",
        category: "Electricity",
        description: "The ceiling fan in room A-101 has stopped working since two days. Making sparking noise when turned on.",
        hostelName: "Ganga Hostel",
        roomNumber: "A-101",
        priority: "High",
        status: "In Progress",
        trackerStage: "IN_PROGRESS", // SUBMITTED -> ASSIGNED -> IN_TRANSIT -> IN_PROGRESS -> RESOLVED
        technician: SAMPLE_TECHNICIANS[0], // Rameshwar Sharma
        resolutionOtp: "4829",
        otpVerified: false,
        roomInstructions: {
          preferredTime: "After 4:00 PM",
          keyStatus: "Roommate inside",
          callBeforeEntry: true,
          notes: "Please knock gently, online lecture ongoing before 4 PM.",
        },
        chatMessages: [
          {
            id: "m-1",
            sender: "student",
            senderName: "Rohan Deshmukh",
            text: "Hello Bhaiya, fan is sparking. Please visit in the evening.",
            timestamp: "2026-08-01T11:00:00Z",
            isVoiceNote: false,
          },
          {
            id: "m-2",
            sender: "admin",
            senderName: "Rameshwar (Electrician)",
            text: "Hello Rohan, I have received the ticket. I am carrying a new capacitor and regulator. Will arrive by 4:30 PM.",
            timestamp: "2026-08-01T11:15:00Z",
            isVoiceNote: false,
          },
          {
            id: "m-3",
            sender: "admin",
            senderName: "Rameshwar (Electrician)",
            text: "Bhaiya spare parts collect kar liye hain store se. 10 min me aapke room pe aa raha hu.",
            audioDuration: "0:12",
            timestamp: "2026-08-01T16:20:00Z",
            isVoiceNote: true,
          },
        ],
        adminResponse: "Electrician has been assigned with new capacitor. Work currently in progress.",
        image: null,
        createdAt: "2026-08-01T10:30:00Z",
      },
      {
        id: 102,
        studentId: 1,
        studentName: "Rohan Deshmukh",
        title: "Water leakage in bathroom",
        category: "Water",
        description: "There is continuous water leakage from the bathroom pipe.",
        hostelName: "Ganga Hostel",
        roomNumber: "A-101",
        priority: "Medium",
        status: "In Progress",
        trackerStage: "IN_TRANSIT",
        technician: SAMPLE_TECHNICIANS[1], // Mukesh Kumar
        resolutionOtp: "7315",
        otpVerified: false,
        roomInstructions: {
          preferredTime: "Morning 10 AM - 12 PM",
          keyStatus: "I will be present",
          callBeforeEntry: false,
          notes: "Leakage is near the washbasin tap.",
        },
        chatMessages: [
          {
            id: "m-1",
            sender: "admin",
            senderName: "Mukesh Kumar (Plumber)",
            text: "En route to Ganga Hostel Block A with plumbing kit.",
            timestamp: "2026-08-04T09:30:00Z",
            isVoiceNote: false,
          },
        ],
        adminResponse: "Plumber Mukesh dispatched.",
        image: null,
        createdAt: "2026-08-04T09:15:00Z",
      },
      {
        id: 103,
        studentId: 2,
        studentName: "Ananya Sharma",
        title: "Wi-Fi not working in room",
        category: "Wi-Fi",
        description: "Wi-Fi signal is extremely weak in room B-204.",
        hostelName: "Yamuna Hostel",
        roomNumber: "B-204",
        priority: "Low",
        status: "Resolved",
        trackerStage: "RESOLVED",
        technician: SAMPLE_TECHNICIANS[2], // Imran Khan
        resolutionOtp: "9042",
        otpVerified: true,
        roomInstructions: {
          preferredTime: "Anytime",
          keyStatus: "Key at hostel reception",
          callBeforeEntry: true,
          notes: "",
        },
        chatMessages: [
          {
            id: "m-1",
            sender: "admin",
            senderName: "Imran Khan (Network)",
            text: "Replaced 5GHz Access Point on Floor 2. Speed tested: 95 Mbps.",
            timestamp: "2026-07-28T15:00:00Z",
            isVoiceNote: false,
          },
          {
            id: "m-2",
            sender: "student",
            senderName: "Ananya Sharma",
            text: "Thanks! Speed is great now. Sharing OTP for closure: 9042",
            timestamp: "2026-07-28T15:10:00Z",
            isVoiceNote: false,
          },
        ],
        adminResponse: "Router and AP replaced. Verified with Student OTP.",
        image: null,
        createdAt: "2026-07-28T14:00:00Z",
      },
      {
        id: 104,
        studentId: 2,
        studentName: "Ananya Sharma",
        title: "Mess food quality complaint",
        category: "Food",
        description: "Food served yesterday was not properly cooked and chapati was stale.",
        hostelName: "Yamuna Hostel",
        roomNumber: "B-204",
        priority: "Medium",
        status: "Rejected",
        trackerStage: "SUBMITTED",
        technician: null,
        resolutionOtp: "1198",
        otpVerified: false,
        roomInstructions: {
          preferredTime: "Anytime",
          keyStatus: "I will be present",
          callBeforeEntry: false,
          notes: "",
        },
        chatMessages: [],
        adminResponse: "Kitchen staff investigated - please submit daily meal rating via Mess Matrix tab for automated contractor flagging.",
        image: null,
        createdAt: "2026-08-02T18:45:00Z",
      },
    ],
    // Mess Menu (7-day cyclic menu)
    messMenu: {
      Monday: {
        breakfast: { items: "Aloo Paratha, Curd, Pickle, Boiled Eggs / Banana, Tea / Coffee", calories: "450 kcal" },
        lunch: { items: "Rajma Masala, Steamed Basmati Rice, Mix Veg, Phulka (Roti), Boondi Raita, Salad", calories: "680 kcal" },
        snacks: { items: "Samosa / Poha, Mint Chutney, Masala Chai", calories: "280 kcal" },
        dinner: { items: "Paneer Butter Masala, Yellow Dal Tadka, Jeera Rice, Tandoori Roti, Gulab Jamun", calories: "720 kcal" },
      },
      Tuesday: {
        breakfast: { items: "Idli, Medu Vada, Sambar, Coconut Chutney, Tea / Coffee", calories: "420 kcal" },
        lunch: { items: "Kadhi Pakoda, Jeera Rice, Aloo Gobhi Dry, Chapati, Papad, Green Salad", calories: "640 kcal" },
        snacks: { items: "Veg Sandwich, Green Tea / Filter Coffee", calories: "250 kcal" },
        dinner: { items: "Egg Curry / Malai Kofta, Dal Makhani, Steamed Rice, Butter Naan, Fruit Custard", calories: "750 kcal" },
      },
      Wednesday: {
        breakfast: { items: "Poori Bhaji (Aloo Curry), Sooji Halwa, Sprouts Salad, Tea", calories: "520 kcal" },
        lunch: { items: "Chole Bhature / Rice, Dal Fry, Seasonal Veg, Curd, Pickle", calories: "710 kcal" },
        snacks: { items: "Bread Pakoda, Tomato Sauce, Ginger Tea", calories: "310 kcal" },
        dinner: { items: "Chicken Curry / Shahi Paneer, Dal Tadka, Peas Pulao, Chapati, Ice Cream", calories: "780 kcal" },
      },
      Thursday: {
        breakfast: { items: "Poha with Roasted Peanuts, Sev, Boiled Corn, Tea / Milk", calories: "380 kcal" },
        lunch: { items: "Dal Palak, Baingan Bharta, Steamed Rice, Phulka, Butter Milk, Onion Salad", calories: "600 kcal" },
        snacks: { items: "Pav Bhaji (2 pcs), Lemonade / Tea", calories: "340 kcal" },
        dinner: { items: "Mushroom Masala / Mix Veg, Dal Fry, Jeera Rice, Roti, Kheer", calories: "690 kcal" },
      },
      Friday: {
        breakfast: { items: "Masala Dosa, Tomato Chutney, Sambar, Sweet Kesari Bath, Coffee", calories: "460 kcal" },
        lunch: { items: "Veg Biryani / Dum Chicken Biryani, Mirchi Ka Salan, Veg Raita, Gulab Jamun", calories: "790 kcal" },
        snacks: { items: "Veg Cutlet, Masala Chai", calories: "270 kcal" },
        dinner: { items: "Dum Aloo Kashmiri, Dal Makhani, Steamed Rice, Butter Roti, Rasgulla", calories: "730 kcal" },
      },
      Saturday: {
        breakfast: { items: "Stuffed Gobhi/Paneer Paratha, Butter, Pickle, Dahi, Tea", calories: "490 kcal" },
        lunch: { items: "Sambhar Rice, Poriyal, Rasam, Papad, Curd Rice, Payasam", calories: "630 kcal" },
        snacks: { items: "Pasta / Maggi with Veggies, Cold Coffee", calories: "320 kcal" },
        dinner: { items: "Matar Paneer, Chana Dal Fry, Pulao, Missi Roti, Moong Dal Halwa", calories: "760 kcal" },
      },
      Sunday: {
        breakfast: { items: "Chole Kulche, Sweet Lassi, Fresh Fruits, Tea", calories: "540 kcal" },
        lunch: { items: "Special Sunday Feast: Paneer Lababdar, Dal Bukhara, Fried Rice, Naan, Jalebi", calories: "820 kcal" },
        snacks: { items: "Bhel Puri / Sev Puri, Masala Tea", calories: "230 kcal" },
        dinner: { items: "Light Khichdi / Kadhi Chawal, Aloo Bhaja, Roasted Papad, Ice Cream", calories: "580 kcal" },
      },
    },
    // Mess live reviews & hygiene matrix
    messReviews: [
      {
        id: "mr-101",
        studentId: 1,
        studentName: "Rohan Deshmukh",
        hostelName: "Ganga Hostel",
        mealType: "lunch",
        mealName: "Lunch (Rajma Rice)",
        date: new Date().toISOString().split("T")[0],
        ratings: {
          taste: 4,
          hygiene: 5,
          freshness: 4,
          portions: 5,
        },
        overallScore: 4.5,
        issues: [],
        comment: "Rajma was very flavorful today and spoons were properly sanitized!",
        image: null,
        createdAt: "2026-10-05T13:15:00Z",
        contractorFlagged: false,
      },
      {
        id: "mr-102",
        studentId: 2,
        studentName: "Ananya Sharma",
        hostelName: "Yamuna Hostel",
        mealType: "lunch",
        mealName: "Lunch (Rajma Rice)",
        date: new Date().toISOString().split("T")[0],
        ratings: {
          taste: 2,
          hygiene: 2,
          freshness: 2,
          portions: 3,
        },
        overallScore: 2.25,
        issues: ["Stale / Cold Food", "Unhygienic Utensils / Spoons"],
        comment: "Chapatis were cold and dry. Please check the plate washing area, noticed grease on stainless steel trays.",
        image: null,
        createdAt: "2026-10-05T13:40:00Z",
        contractorFlagged: true,
      },
      {
        id: "mr-103",
        studentId: 1,
        studentName: "Rohan Deshmukh",
        hostelName: "Ganga Hostel",
        mealType: "breakfast",
        mealName: "Breakfast (Aloo Paratha)",
        date: new Date().toISOString().split("T")[0],
        ratings: {
          taste: 5,
          hygiene: 4,
          freshness: 5,
          portions: 4,
        },
        overallScore: 4.5,
        issues: [],
        comment: "Hot parathas served with fresh curd. Really good breakfast.",
        image: null,
        createdAt: "2026-10-05T08:45:00Z",
        contractorFlagged: false,
      },
    ],
    // Mess Admin Actions & Notices
    messActions: [
      {
        id: "act-1",
        date: "2026-10-05T14:30:00Z",
        adminName: "Chief Warden Office",
        title: "Utensil Sanitation Audit Scheduled",
        description: "Surprise inspection ordered for Yamuna Hostel kitchen dishwashing unit following student flags.",
        status: "Notice Issued to Contractor",
      },
    ],
    nextComplaintId: 105,
    nextStudentId: 3,
    nextAdminId: 2,
    nextReviewId: 104,
  };
  localStorage.setItem(DB_KEY, JSON.stringify(seed));
  return seed;
};

export const getDB = () => {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) return seedDatabase();
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.messMenu || !parsed.messReviews) {
      return seedDatabase();
    }
    return parsed;
  } catch {
    return seedDatabase();
  }
};

export const saveDB = (db) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// Simulates network latency so loading spinners are visible/demonstrable.
export const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));