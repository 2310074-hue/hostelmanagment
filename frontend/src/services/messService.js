// ============================================================================
// MESS FOOD & HYGIENE MATRIX SERVICE
// ----------------------------------------------------------------------------
// Wraps meal timetable, live food rating, hygiene index, and contractor actions.
// ============================================================================
import axiosInstance from "../api/axios";
import { getDB, saveDB, delay } from "./mockData";

const USE_MOCK = process.env.REACT_APP_USE_MOCK === "true";

// Helper to find today's weekday name
export const getDayName = (date = new Date()) => {
  return date.toLocaleDateString("en-US", { weekday: "long" });
};

// Helper to determine which meal is currently active based on current hour
export const getCurrentMealSlot = () => {
  const now = new Date();
  const hour = now.getHours();
  const mins = now.getMinutes();
  const totalMins = hour * 60 + mins;

  // Breakfast: 7:00 AM - 10:30 AM (420 - 630)
  if (totalMins >= 420 && totalMins < 630) {
    return "breakfast";
  }
  // Lunch: 11:30 AM - 15:30 PM (690 - 930)
  if (totalMins >= 690 && totalMins < 930) {
    return "lunch";
  }
  // Snacks: 16:30 PM - 18:30 PM (990 - 1110)
  if (totalMins >= 990 && totalMins < 1110) {
    return "snacks";
  }
  // Dinner: 19:30 PM - 22:30 PM (1170 - 1350)
  if (totalMins >= 1170 && totalMins <= 1350) {
    return "dinner";
  }
  // Default to lunch if outside exact hours for convenient demonstration
  return "lunch";
};

// ---------------- GET WEEKLY / TODAY MESS MENU ----------------
export const getMessMenu = async () => {
  if (USE_MOCK) {
    await delay(200);
    const db = getDB();
    return db.messMenu || {};
  }
  const res = await axiosInstance.get("/mess/menu/");
  return res.data;
};

// ---------------- SUBMIT MESS REVIEW & HYGIENE RATING ----------------
export const submitMessReview = async (reviewData, user) => {
  if (USE_MOCK) {
    await delay(300);
    const db = getDB();
    if (!db.messReviews) db.messReviews = [];

    const taste = Number(reviewData.taste) || 4;
    const hygiene = Number(reviewData.hygiene) || 4;
    const freshness = Number(reviewData.freshness) || 4;
    const portions = Number(reviewData.portions) || 4;
    const overallScore = parseFloat(((taste + hygiene + freshness + portions) / 4).toFixed(2));

    const isFlagged =
      hygiene <= 2 ||
      taste <= 2 ||
      (reviewData.issues && reviewData.issues.length > 0);

    const newReview = {
      id: `mr-${db.nextReviewId || Date.now()}`,
      studentId: user.id,
      studentName: user.fullName,
      hostelName: user.hostelName || reviewData.hostelName || "Ganga Hostel",
      mealType: reviewData.mealType || getCurrentMealSlot(),
      mealName: reviewData.mealName || "Current Meal",
      date: new Date().toISOString().split("T")[0],
      ratings: { taste, hygiene, freshness, portions },
      overallScore,
      issues: reviewData.issues || [],
      comment: reviewData.comment || "",
      image: reviewData.image || null,
      createdAt: new Date().toISOString(),
      contractorFlagged: isFlagged,
    };

    db.messReviews.unshift(newReview);
    if (!db.nextReviewId) db.nextReviewId = 105;
    db.nextReviewId += 1;
    saveDB(db);
    return newReview;
  }
  const res = await axiosInstance.post("/mess/reviews/", reviewData);
  return res.data;
};

// ---------------- GET MESS REVIEWS ----------------
export const getMessReviews = async ({ hostelName = null, mealType = null } = {}) => {
  if (USE_MOCK) {
    await delay(250);
    const db = getDB();
    let list = db.messReviews || [];
    if (hostelName && hostelName !== "All") {
      list = list.filter((r) => r.hostelName === hostelName);
    }
    if (mealType && mealType !== "all") {
      list = list.filter((r) => r.mealType === mealType);
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  const params = {};
  if (hostelName) params.hostel = hostelName;
  if (mealType) params.meal = mealType;
  const res = await axiosInstance.get("/mess/reviews/", { params });
  return res.data;
};

// ---------------- GET MESS STATS & HYGIENE INDEX ----------------
export const getMessStats = async () => {
  if (USE_MOCK) {
    await delay(200);
    const db = getDB();
    const reviews = db.messReviews || [];

    if (reviews.length === 0) {
      return {
        avgHygiene: 4.5,
        avgTaste: 4.2,
        avgOverall: 4.3,
        totalReviews: 0,
        flaggedCount: 0,
        recentIssues: [],
        mealBreakdown: {
          breakfast: 4.5,
          lunch: 4.0,
          snacks: 4.2,
          dinner: 4.1,
        },
      };
    }

    const sumHygiene = reviews.reduce((acc, r) => acc + (r.ratings.hygiene || 0), 0);
    const sumTaste = reviews.reduce((acc, r) => acc + (r.ratings.taste || 0), 0);
    const sumOverall = reviews.reduce((acc, r) => acc + (r.overallScore || 0), 0);
    const flagged = reviews.filter((r) => r.contractorFlagged);

    const calcMealAvg = (meal) => {
      const match = reviews.filter((r) => r.mealType === meal);
      if (!match.length) return 4.0;
      return parseFloat((match.reduce((a, b) => a + b.overallScore, 0) / match.length).toFixed(1));
    };

    // aggregate frequent issues
    const issueMap = {};
    reviews.forEach((r) => {
      (r.issues || []).forEach((issue) => {
        issueMap[issue] = (issueMap[issue] || 0) + 1;
      });
    });

    return {
      avgHygiene: parseFloat((sumHygiene / reviews.length).toFixed(1)),
      avgTaste: parseFloat((sumTaste / reviews.length).toFixed(1)),
      avgOverall: parseFloat((sumOverall / reviews.length).toFixed(1)),
      totalReviews: reviews.length,
      flaggedCount: flagged.length,
      topIssues: Object.entries(issueMap).sort((a, b) => b[1] - a[1]),
      mealBreakdown: {
        breakfast: calcMealAvg("breakfast"),
        lunch: calcMealAvg("lunch"),
        snacks: calcMealAvg("snacks"),
        dinner: calcMealAvg("dinner"),
      },
      actions: db.messActions || [],
    };
  }
  const res = await axiosInstance.get("/mess/stats/");
  return res.data;
};

// ---------------- ADMIN: POST CONTRACTOR NOTICE / ACTION ----------------
export const addAdminMessAction = async (actionData, adminUser) => {
  if (USE_MOCK) {
    await delay(200);
    const db = getDB();
    if (!db.messActions) db.messActions = [];

    const newAction = {
      id: `act-${Date.now()}`,
      date: new Date().toISOString(),
      adminName: adminUser.fullName || "Hostel Warden",
      title: actionData.title,
      description: actionData.description,
      status: actionData.status || "Notice Issued to Contractor",
    };

    db.messActions.unshift(newAction);
    saveDB(db);
    return newAction;
  }
  const res = await axiosInstance.post("/mess/actions/", actionData);
  return res.data;
};

// ---------------- ADMIN: UPDATE MESS MENU ITEM ----------------
export const updateMessMenu = async (day, mealType, itemsText, calories) => {
  if (USE_MOCK) {
    await delay(200);
    const db = getDB();
    if (!db.messMenu) db.messMenu = {};
    if (!db.messMenu[day]) db.messMenu[day] = {};

    db.messMenu[day][mealType] = {
      items: itemsText,
      calories: calories || "550 kcal",
    };

    saveDB(db);
    return db.messMenu;
  }
  const res = await axiosInstance.put(`/mess/menu/${day}/${mealType}/`, { itemsText, calories });
  return res.data;
};
