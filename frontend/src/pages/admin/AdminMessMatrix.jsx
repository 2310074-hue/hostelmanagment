import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import SuccessMessage from "../../components/SuccessMessage";
import ErrorMessage from "../../components/ErrorMessage";
import { MESS_MEALS } from "../../utils/constants";
import {
  getMessStats,
  getMessReviews,
  getMessMenu,
  addAdminMessAction,
  updateMessMenu,
} from "../../services/messService";
import { useAuth } from "../../context/AuthContext";

const PRESET_TEMPLATES = {
  northIndian: {
    name: "North Indian Standard",
    breakfast: { items: "Aloo Paratha, Fresh Curd, Mixed Pickle, Boiled Eggs / Banana, Masala Chai", calories: "460 kcal" },
    lunch: { items: "Rajma Masala, Steamed Basmati Rice, Mix Veg, Phulka (Roti), Boondi Raita, Salad", calories: "680 kcal" },
    snacks: { items: "Samosa (2 pcs), Green Mint Chutney, Adrak Chai", calories: "290 kcal" },
    dinner: { items: "Paneer Butter Masala, Dal Tadka, Jeera Rice, Tandoori Roti, Gulab Jamun", calories: "740 kcal" },
  },
  southIndian: {
    name: "South Indian Feast",
    breakfast: { items: "Masala Dosa, Medu Vada, Coconut Chutney, Tomato Chutney, Drumstick Sambar, Filter Coffee", calories: "440 kcal" },
    lunch: { items: "Sambhar Rice, Beans Poriyal, Rasam, Appalam (Papad), Curd Rice, Semiypayasam", calories: "650 kcal" },
    snacks: { items: "Banana Chips, Mysore Bonda, Filter Coffee", calories: "270 kcal" },
    dinner: { items: "Malabar Parotta, Veg Kurma / Chicken Chettinad, Ghee Rice, Raita, Kesari Bath", calories: "760 kcal" },
  },
  highProtein: {
    name: "High Protein Fitness Diet",
    breakfast: { items: "Oatmeal with Almonds & Banana, Boiled Eggs (3 pcs) / Tofu Scramble, Green Tea", calories: "420 kcal" },
    lunch: { items: "Soya Chunks Curry, Brown Rice, Yellow Moong Dal, Multigrain Roti, Cucumber Salad", calories: "620 kcal" },
    snacks: { items: "Boiled Chickpea / Sprouts Chaat, Lemonade", calories: "210 kcal" },
    dinner: { items: "Grilled Paneer / Grilled Chicken Breast, Dal Palak, Steamed Rice, Phulka, Fruit Bowl", calories: "690 kcal" },
  },
  sundaySpecial: {
    name: "Grand Sunday Feast",
    breakfast: { items: "Chole Bhature (2 pcs), Sweet Lassi, Mixed Fruits, Tea / Coffee", calories: "550 kcal" },
    lunch: { items: "Special Dum Biryani (Veg/Chicken), Mirchi Ka Salan, Onion Raita, Butter Naan, Jalebi", calories: "850 kcal" },
    snacks: { items: "Pav Bhaji (2 buttery pavs), Cold Coffee", calories: "360 kcal" },
    dinner: { items: "Paneer Lababdar, Dal Bukhara, Peas Pulao, Tandoori Butter Roti, Ice Cream Sundae", calories: "800 kcal" },
  },
};

const AdminMessMatrix = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [weeklyMenu, setWeeklyMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filters
  const [hostelFilter, setHostelFilter] = useState("All");
  const [mealFilter, setMealFilter] = useState("all");

  // Selected Day for Visual Timetable
  const [selectedDay, setSelectedDay] = useState("Monday");

  // Notice Action Form
  const [actionTitle, setActionTitle] = useState("");
  const [actionDesc, setActionDesc] = useState("");
  const [actionStatus, setActionStatus] = useState("Notice Issued to Contractor");
  const [submittingAction, setSubmittingAction] = useState(false);

  // Live Menu Editor State
  const [editDay, setEditDay] = useState("Monday");
  const [editMeal, setEditMeal] = useState("lunch");
  const [editItems, setEditItems] = useState("");
  const [editCalories, setEditCalories] = useState("680 kcal");
  const [savingMenu, setSavingMenu] = useState(false);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsData, reviewsData, menuData] = await Promise.all([
        getMessStats(),
        getMessReviews({ hostelName: hostelFilter, mealType: mealFilter }),
        getMessMenu(),
      ]);
      setStats(statsData);
      setReviews(reviewsData);
      setWeeklyMenu(menuData);
      if (menuData[editDay]?.[editMeal]) {
        setEditItems(menuData[editDay][editMeal].items || "");
        setEditCalories(menuData[editDay][editMeal].calories || "650 kcal");
      }
    } catch (err) {
      setError("Failed to load Mess Matrix data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostelFilter, mealFilter]);

  useEffect(() => {
    if (weeklyMenu[editDay]?.[editMeal]) {
      setEditItems(weeklyMenu[editDay][editMeal].items || "");
      setEditCalories(weeklyMenu[editDay][editMeal].calories || "650 kcal");
    }
  }, [editDay, editMeal, weeklyMenu]);

  const handlePostAction = async (e) => {
    e.preventDefault();
    if (!actionTitle.trim() || !actionDesc.trim()) return;
    setSubmittingAction(true);
    setSuccess("");
    try {
      await addAdminMessAction(
        {
          title: actionTitle.trim(),
          description: actionDesc.trim(),
          status: actionStatus,
        },
        user
      );
      setSuccess("Official contractor notice / penalty action logged successfully.");
      setActionTitle("");
      setActionDesc("");
      const updatedStats = await getMessStats();
      setStats(updatedStats);
    } catch (err) {
      setError("Failed to record action notice.");
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    if (!editItems.trim()) return;
    setSavingMenu(true);
    setSuccess("");
    try {
      const updatedMenu = await updateMessMenu(editDay, editMeal, editItems.trim(), editCalories.trim());
      setWeeklyMenu(updatedMenu);
      setSuccess(`✅ Mess menu updated for ${editDay} (${editMeal.toUpperCase()}). Students will see this live!`);
    } catch (err) {
      setError("Failed to update menu.");
    } finally {
      setSavingMenu(false);
    }
  };

  const applyPresetTemplate = async (templateKey) => {
    const template = PRESET_TEMPLATES[templateKey];
    if (!template) return;
    setSavingMenu(true);
    setSuccess("");
    try {
      for (const mealKey of ["breakfast", "lunch", "snacks", "dinner"]) {
        await updateMessMenu(
          editDay,
          mealKey,
          template[mealKey].items,
          template[mealKey].calories
        );
      }
      const updated = await getMessMenu();
      setWeeklyMenu(updated);
      setEditItems(template[editMeal].items);
      setEditCalories(template[editMeal].calories);
      setSuccess(`🎉 Applied "${template.name}" template to ${editDay}!`);
    } catch (err) {
      setError("Failed to apply preset.");
    } finally {
      setSavingMenu(false);
    }
  };

  const openQuickEdit = (day, mealKey) => {
    setEditDay(day);
    setEditMeal(mealKey);
    const item = weeklyMenu[day]?.[mealKey];
    if (item) {
      setEditItems(item.items || "");
      setEditCalories(item.calories || "650 kcal");
    }
    const editorElem = document.getElementById("menu-editor-section");
    if (editorElem) {
      editorElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const selectedDayMenu = weeklyMenu[selectedDay] || {};

  return (
    <Layout role="admin" title="Mess Food Quality & Menu Management Matrix">
      {/* Header Banner */}
      <div className="admin-mess-hero p-4 mb-4 rounded-4 text-white">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <span className="badge bg-danger text-white px-3 py-1 mb-2 fw-bold text-uppercase">
              <i className="bi bi-shield-lock-fill me-1"></i> Contractor & Menu Administration
            </span>
            <h3 className="fw-bold mb-1">Mess Food Matrix & Live Menu Control Center</h3>
            <p className="mb-0 opacity-90">
              Customize daily hostel meals, audit hygiene index ratings, and enforce catering contractor quality standards.
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-light fw-bold px-3 shadow-sm"
              onClick={loadAll}
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh Matrix
            </button>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner text="Computing Hygiene Index & live ratings..." />}
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      {!loading && stats && (
        <>
          {/* Key Metrics Row */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="hcms-card p-3 border-start border-4 border-primary h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted text-uppercase fw-bold">Overall Quality Index</small>
                    <h3 className="mb-0 fw-bold mt-1 text-primary">{stats.avgOverall} <span className="fs-6 text-muted">/ 5.0</span></h3>
                  </div>
                  <div className="fs-1 text-primary opacity-50"><i className="bi bi-award-fill"></i></div>
                </div>
                <div className="small text-muted mt-2">
                  <i className="bi bi-people-fill me-1"></i> Based on {stats.totalReviews} student audits
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="hcms-card p-3 border-start border-4 border-success h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted text-uppercase fw-bold">Kitchen & Dining Hygiene</small>
                    <h3 className="mb-0 fw-bold mt-1 text-success">{stats.avgHygiene} <span className="fs-6 text-muted">/ 5.0</span></h3>
                  </div>
                  <div className="fs-1 text-success opacity-50"><i className="bi bi-shield-check"></i></div>
                </div>
                <div className="small text-success mt-2">
                  <i className="bi bi-check2-all me-1"></i> Utensil & water sanitation
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="hcms-card p-3 border-start border-4 border-warning h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted text-uppercase fw-bold">Taste & Seasoning</small>
                    <h3 className="mb-0 fw-bold mt-1 text-warning">{stats.avgTaste} <span className="fs-6 text-muted">/ 5.0</span></h3>
                  </div>
                  <div className="fs-1 text-warning opacity-50"><i className="bi bi-heart-pulse-fill"></i></div>
                </div>
                <div className="small text-muted mt-2">
                  <i className="bi bi-graph-up me-1"></i> Student satisfaction score
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="hcms-card p-3 border-start border-4 border-danger h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted text-uppercase fw-bold">Contractor Flags</small>
                    <h3 className="mb-0 fw-bold mt-1 text-danger">{stats.flaggedCount} <span className="fs-6 text-muted">active</span></h3>
                  </div>
                  <div className="fs-1 text-danger opacity-50"><i className="bi bi-flag-fill"></i></div>
                </div>
                <div className="small text-danger mt-2">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i> Poor ratings & hygiene issues
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
             SECTION: VISUAL 7-DAY MENU BROWSER & QUICK EDIT
             ========================================================================= */}
          <div className="hcms-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <div>
                <h5 className="fw-bold mb-1">
                  <i className="bi bi-calendar3-week text-primary me-2"></i>
                  Weekly Mess Menu Browser & 1-Click Editor
                </h5>
                <p className="text-muted small mb-0">Select any day to inspect meal items or click "Quick Edit" to modify what students see.</p>
              </div>
              <span className="badge bg-success-subtle text-success border border-success px-3 py-2">
                <i className="bi bi-broadcast me-1"></i> Live Synced with Student Portal
              </span>
            </div>

            {/* Day Selector Pills */}
            <div className="day-pills-bar d-flex gap-2 overflow-auto pb-2 pt-1 mb-3">
              {daysOfWeek.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`btn btn-sm ${
                    selectedDay === d ? "btn-primary shadow" : "btn-light border"
                  } text-nowrap px-3 py-2 rounded-pill fw-semibold`}
                  onClick={() => setSelectedDay(d)}
                >
                  <i className="bi bi-calendar-event me-1"></i> {d}
                </button>
              ))}
            </div>

            {/* Visual 4-Meal Cards for Selected Day */}
            <div className="row g-3">
              {MESS_MEALS.map((meal) => {
                const mealData = selectedDayMenu[meal.id] || { items: "Menu not set", calories: "N/A" };
                return (
                  <div key={meal.id} className="col-md-3 col-sm-6">
                    <div className="p-3 rounded-3 border bg-light h-100 d-flex flex-column justify-content-between meal-admin-card shadow-sm">
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className={`badge bg-${meal.badgeColor} px-2 py-1`}>
                            <i className={`bi ${meal.icon} me-1`}></i> {meal.name}
                          </span>
                          <span className="small text-muted fw-bold">{mealData.calories}</span>
                        </div>
                        <p className="small text-dark fw-medium mb-3 meal-items-preview">
                          {mealData.items}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary w-100 rounded-pill mt-2 fw-semibold"
                        onClick={() => openQuickEdit(selectedDay, meal.id)}
                      >
                        <i className="bi bi-pencil-square me-1"></i> Edit {meal.name}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =========================================================================
             SECTION: LIVE MENU CUSTOMIZER & CONTRACTOR NOTICE TOOL
             ========================================================================= */}
          <div className="row g-4 mb-4" id="menu-editor-section">
            {/* Menu Editor Form */}
            <div className="col-lg-7">
              <div className="hcms-card p-4 h-100 border border-primary border-opacity-25 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="fw-bold mb-0 text-primary">
                    <i className="bi bi-sliders me-2"></i>
                    Live Meal Editor
                  </h5>
                  <span className="badge bg-primary text-capitalize px-3 py-1">
                    {editDay} • {editMeal.toUpperCase()}
                  </span>
                </div>
                <p className="text-muted small mb-3">
                  Instantly customize food items, calorie values, or apply curated presets for {editDay}.
                </p>

                {/* Quick Presets Bar */}
                <div className="mb-3 p-2 rounded-3 bg-light border">
                  <span className="small fw-bold text-muted d-block mb-1">
                    <i className="bi bi-magic me-1 text-warning"></i> 1-Click Menu Presets for {editDay}:
                  </span>
                  <div className="d-flex gap-1 flex-wrap">
                    <button
                      type="button"
                      className="btn btn-xs btn-outline-secondary rounded-pill small px-2 py-1"
                      style={{ fontSize: "0.76rem" }}
                      onClick={() => applyPresetTemplate("northIndian")}
                    >
                      🍲 North Indian Standard
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs btn-outline-secondary rounded-pill small px-2 py-1"
                      style={{ fontSize: "0.76rem" }}
                      onClick={() => applyPresetTemplate("southIndian")}
                    >
                      🥥 South Indian Feast
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs btn-outline-secondary rounded-pill small px-2 py-1"
                      style={{ fontSize: "0.76rem" }}
                      onClick={() => applyPresetTemplate("highProtein")}
                    >
                      🏋️ High Protein Fitness
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs btn-outline-secondary rounded-pill small px-2 py-1"
                      style={{ fontSize: "0.76rem" }}
                      onClick={() => applyPresetTemplate("sundaySpecial")}
                    >
                      🎉 Sunday Grand Feast
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSaveMenu}>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-bold">Select Day</label>
                      <select
                        className="form-select form-select-sm"
                        value={editDay}
                        onChange={(e) => setEditDay(e.target.value)}
                      >
                        {daysOfWeek.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold">Select Meal Slot</label>
                      <select
                        className="form-select form-select-sm"
                        value={editMeal}
                        onChange={(e) => setEditMeal(e.target.value)}
                      >
                        {MESS_MEALS.map((m) => (
                          <option key={m.id} value={m.id}>{m.name} ({m.time})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">
                      Menu Items Description (Comma separated)
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={editItems}
                      onChange={(e) => setEditItems(e.target.value)}
                      placeholder="e.g. Paneer Butter Masala, Yellow Dal Tadka, Jeera Rice, Tandoori Roti, Gulab Jamun, Fresh Salad"
                      required
                    ></textarea>
                    <small className="text-muted extra-small">
                      Tip: Include main curry, bread/rice, dessert, and side salads for clear student guidance.
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">
                      Estimated Nutritional Energy (Calories)
                    </label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text"><i className="bi bi-lightning-charge text-warning"></i></span>
                      <input
                        type="text"
                        className="form-control"
                        value={editCalories}
                        onChange={(e) => setEditCalories(e.target.value)}
                        placeholder="e.g. 720 kcal"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                    disabled={savingMenu}
                  >
                    {savingMenu ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        <span>Saving & Syncing to Live Portal...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cloud-arrow-up-fill"></i>
                        <span>Save & Publish Menu for {editDay} ({editMeal.toUpperCase()})</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contractor Notice Action Form */}
            <div className="col-lg-5">
              <div className="hcms-card p-4 h-100 border border-danger border-opacity-25">
                <h5 className="fw-bold mb-2 text-danger">
                  <i className="bi bi-envelope-paper-fill me-2"></i>
                  Contractor Penalty & Notice Logger
                </h5>
                <p className="text-muted small mb-3">
                  Issue formal warnings, surprise kitchen inspections, or financial deductions for food quality defaults.
                </p>

                <form onSubmit={handlePostAction}>
                  <div className="mb-2">
                    <label className="form-label small fw-bold">Notice Subject</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. Warning for Cold Food during Lunch"
                      value={actionTitle}
                      onChange={(e) => setActionTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-bold">Action / Audit Details</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="3"
                      placeholder="Details of warning, kitchen audit, or penalty applied..."
                      value={actionDesc}
                      onChange={(e) => setActionDesc(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Action Type</label>
                    <select
                      className="form-select form-select-sm"
                      value={actionStatus}
                      onChange={(e) => setActionStatus(e.target.value)}
                    >
                      <option value="Notice Issued to Contractor">Notice Issued to Contractor</option>
                      <option value="Surprise Kitchen Inspection Scheduled">Surprise Kitchen Inspection Scheduled</option>
                      <option value="Financial Penalty Deducted">Financial Penalty Deducted from Bill</option>
                      <option value="Staff Replacement Mandated">Staff Replacement Mandated</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-danger btn-sm w-100 fw-bold py-2"
                    disabled={submittingAction}
                  >
                    {submittingAction ? "Recording Notice..." : "Issue & Log Official Action"}
                  </button>
                </form>

                {/* Past Actions Stream */}
                {stats.actions && stats.actions.length > 0 && (
                  <div className="mt-3 pt-3 border-top">
                    <small className="fw-bold text-muted d-block mb-2">Recent Enforcement Actions:</small>
                    <div className="d-flex flex-column gap-2" style={{ maxHeight: "140px", overflowY: "auto" }}>
                      {stats.actions.map((act) => (
                        <div key={act.id} className="p-2 rounded bg-light border small">
                          <div className="d-flex justify-content-between fw-bold">
                            <span>{act.title}</span>
                            <span className="badge bg-danger text-white">{act.status}</span>
                          </div>
                          <div className="text-muted mt-1">{act.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Student Reviews Moderation Stream */}
          <div className="hcms-card p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-chat-left-text-fill text-primary me-2"></i>
                Student Reviews & Live Feedback Feed ({reviews.length})
              </h5>
              <div className="d-flex gap-2">
                <select
                  className="form-select form-select-sm"
                  value={hostelFilter}
                  onChange={(e) => setHostelFilter(e.target.value)}
                >
                  <option value="All">All Hostels</option>
                  <option value="Ganga Hostel">Ganga Hostel</option>
                  <option value="Yamuna Hostel">Yamuna Hostel</option>
                </select>
                <select
                  className="form-select form-select-sm"
                  value={mealFilter}
                  onChange={(e) => setMealFilter(e.target.value)}
                >
                  <option value="all">All Meals</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="snacks">Snacks</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>
            </div>

            <div className="reviews-admin-stream d-flex flex-column gap-3" style={{ maxHeight: "380px", overflowY: "auto" }}>
              {reviews.length === 0 ? (
                <div className="text-center text-muted py-4">No reviews matching the filter criteria.</div>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`p-3 rounded-3 border ${
                      rev.contractorFlagged ? "border-danger bg-danger-subtle bg-opacity-10" : "bg-light"
                    }`}
                  >
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-1">
                      <div>
                        <span className="fw-bold">{rev.studentName}</span>
                        <span className="badge bg-secondary-subtle text-secondary ms-2">{rev.hostelName}</span>
                        <span className="badge bg-dark-subtle text-dark ms-1">{rev.mealName}</span>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <span className="badge bg-warning text-dark fw-bold">
                          {rev.overallScore} ★
                        </span>
                        {rev.contractorFlagged && (
                          <span className="badge bg-danger text-white">
                            <i className="bi bi-flag-fill me-1"></i> Flagged
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="d-flex gap-3 small text-muted my-1">
                      <span>Taste: {rev.ratings.taste}★</span>
                      <span>Hygiene: {rev.ratings.hygiene}★</span>
                      <span>Freshness: {rev.ratings.freshness}★</span>
                      <span>Portion: {rev.ratings.portions}★</span>
                    </div>

                    {rev.issues && rev.issues.length > 0 && (
                      <div className="d-flex gap-1 flex-wrap my-1">
                        {rev.issues.map((iss, idx) => (
                          <span key={idx} className="badge bg-danger text-white small">
                            {iss}
                          </span>
                        ))}
                      </div>
                    )}

                    {rev.comment && (
                      <p className="mb-0 small text-dark mt-1 fst-italic">"{rev.comment}"</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default AdminMessMatrix;
