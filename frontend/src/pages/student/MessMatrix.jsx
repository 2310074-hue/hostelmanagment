import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import SuccessMessage from "../../components/SuccessMessage";
import ErrorMessage from "../../components/ErrorMessage";
import { MESS_MEALS, MESS_ISSUE_TAGS } from "../../utils/constants";
import {
  getMessMenu,
  getMessReviews,
  submitMessReview,
  getDayName,
  getCurrentMealSlot,
} from "../../services/messService";
import { useAuth } from "../../context/AuthContext";

const StarRating = ({ value, onChange, label, icon }) => {
  return (
    <div className="star-rating-block mb-3 p-2 border rounded-3 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="small fw-semibold text-dark">
          <i className={`bi ${icon} me-1 text-primary`}></i> {label}
        </span>
        <span className="badge bg-primary px-2">{value} / 5</span>
      </div>
      <div className="d-flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`btn btn-sm p-0 border-0 fs-5 star-btn ${
              star <= value ? "text-warning" : "text-secondary opacity-25"
            }`}
            onClick={() => onChange(star)}
          >
            <i className="bi bi-star-fill"></i>
          </button>
        ))}
      </div>
    </div>
  );
};

const MessMatrix = () => {
  const { user } = useAuth();
  const todayDay = getDayName();
  const currentSlot = getCurrentMealSlot();

  const [activeDay, setActiveDay] = useState(todayDay);
  const [activeMealSlot, setActiveMealSlot] = useState(currentSlot);
  const [weeklyMenu, setWeeklyMenu] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Form State
  const [taste, setTaste] = useState(4);
  const [hygiene, setHygiene] = useState(4);
  const [freshness, setFreshness] = useState(4);
  const [portions, setPortions] = useState(4);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [comment, setComment] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [menuData, reviewData] = await Promise.all([
        getMessMenu(),
        getMessReviews({ hostelName: user?.hostelName || "All" }),
      ]);
      setWeeklyMenu(menuData);
      setReviews(reviewData);
    } catch (err) {
      setError("Failed to load Mess Matrix data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleIssueTag = (tag) => {
    if (selectedIssues.includes(tag)) {
      setSelectedIssues(selectedIssues.filter((t) => t !== tag));
    } else {
      setSelectedIssues([...selectedIssues, tag]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setSubmitting(true);

    try {
      const currentMenuObj = weeklyMenu[activeDay]?.[activeMealSlot];
      const mealName = `${MESS_MEALS.find((m) => m.id === activeMealSlot)?.name} (${currentMenuObj?.items?.split(",")[0] || "Special"})`;

      await submitMessReview(
        {
          mealType: activeMealSlot,
          mealName,
          hostelName: user?.hostelName || "Ganga Hostel",
          taste,
          hygiene,
          freshness,
          portions,
          issues: selectedIssues,
          comment,
          image: imagePreview,
        },
        user
      );

      setSuccess("Your meal feedback & hygiene report has been submitted! It is now visible in the live matrix.");
      setComment("");
      setSelectedIssues([]);
      setImagePreview(null);
      // Reload reviews
      const updatedReviews = await getMessReviews({ hostelName: user?.hostelName || "All" });
      setReviews(updatedReviews);
    } catch (err) {
      setError(err.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeDayMenu = weeklyMenu[activeDay] || {};

  return (
    <Layout role="student" title="Mess Food & Hygiene Live Matrix">
      {/* Top Notification Banner */}
      <div className="mess-hero-banner p-4 mb-4 rounded-4 text-white">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <span className="badge bg-warning text-dark px-3 py-1 mb-2 fw-bold text-uppercase">
              <i className="bi bi-fire me-1"></i> Live Mess Portal
            </span>
            <h3 className="fw-bold mb-1">Hostel Mess Menu & Real-Time Quality Audit</h3>
            <p className="mb-0 opacity-90">
              Rate your daily meals, report unhygienic conditions, and hold catering contractors accountable.
            </p>
          </div>
          <div className="text-md-end bg-white bg-opacity-10 p-3 rounded-3 border border-white border-opacity-25">
            <div className="small text-uppercase opacity-75">Current Active Meal</div>
            <div className="fs-5 fw-bold text-capitalize d-flex align-items-center gap-2 justify-content-md-end">
              <span className="live-pulse-dot"></span>
              {currentSlot} ({MESS_MEALS.find((m) => m.id === currentSlot)?.time})
            </div>
            <div className="small opacity-75 mt-1">Today is {todayDay}</div>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner text="Loading mess menu & matrix reviews..." />}
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      {!loading && (
        <div className="row g-4">
          {/* Left Column: Weekly Menu & Today's Meal Viewer */}
          <div className="col-lg-7">
            {/* Day Selector Pills */}
            <div className="hcms-card p-3 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0">
                  <i className="bi bi-calendar3 me-2 text-primary"></i>Weekly Mess Timetable
                </h6>
                <span className="badge bg-primary-subtle text-primary">7-Day Cyclic</span>
              </div>
              <div className="day-pills-bar d-flex gap-2 overflow-auto pb-1 pt-1">
                {daysOfWeek.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`btn btn-sm ${
                      activeDay === d ? "btn-primary shadow-sm" : "btn-light border"
                    } text-nowrap px-3 rounded-pill`}
                    onClick={() => setActiveDay(d)}
                  >
                    {d === todayDay ? `⭐ ${d} (Today)` : d}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Cards for Selected Day */}
            <div className="row g-3">
              {MESS_MEALS.map((meal) => {
                const mealData = activeDayMenu[meal.id] || { items: "Menu items not updated", calories: "N/A" };
                const isCurrentActiveMeal = activeDay === todayDay && currentSlot === meal.id;

                return (
                  <div key={meal.id} className="col-md-6">
                    <div
                      className={`meal-card p-3 rounded-3 h-100 border ${
                        isCurrentActiveMeal ? "border-primary shadow-sm bg-primary-subtle bg-opacity-10" : "bg-white"
                      }`}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <span className={`badge bg-${meal.badgeColor} p-2 rounded-circle`}>
                            <i className={`bi ${meal.icon}`}></i>
                          </span>
                          <div>
                            <h6 className="mb-0 fw-bold">{meal.name}</h6>
                            <small className="text-muted">{meal.time}</small>
                          </div>
                        </div>
                        {isCurrentActiveMeal && (
                          <span className="badge bg-success text-white px-2 py-1">
                            <i className="bi bi-broadcast me-1"></i> Serving Now
                          </span>
                        )}
                      </div>

                      <p className="meal-items-text text-dark mt-2 mb-2 small fw-medium">
                        {mealData.items}
                      </p>

                      <div className="d-flex justify-content-between align-items-center pt-2 border-top small text-muted">
                        <span><i className="bi bi-lightning-charge text-warning me-1"></i>{mealData.calories}</span>
                        <button
                          type="button"
                          className="btn btn-xs btn-link p-0 text-decoration-none fw-bold"
                          onClick={() => {
                            setActiveMealSlot(meal.id);
                            window.scrollTo({ top: 400, behavior: "smooth" });
                          }}
                        >
                          Rate this meal <i className="bi bi-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Student Reviews Feed */}
            <div className="hcms-card p-4 mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">
                  <i className="bi bi-chat-quote-fill me-2 text-primary"></i>
                  Live Student Reviews & Hygiene Flags ({reviews.length})
                </h6>
                <span className="badge bg-light text-dark border">Recent Feedback</span>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center text-muted py-4">No reviews submitted yet for today.</div>
              ) : (
                <div className="reviews-stream d-flex flex-column gap-3">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className={`p-3 rounded-3 border ${
                        rev.contractorFlagged ? "border-danger bg-danger-subtle bg-opacity-10" : "bg-light"
                      }`}
                    >
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-1">
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-bold">{rev.studentName}</span>
                          <span className="badge bg-secondary-subtle text-secondary small">{rev.hostelName}</span>
                          <span className="badge bg-dark-subtle text-dark small">{rev.mealName}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <span className="badge bg-warning text-dark fw-bold">
                            <i className="bi bi-star-fill me-1"></i> {rev.overallScore} / 5
                          </span>
                          {rev.contractorFlagged && (
                            <span className="badge bg-danger text-white">
                              <i className="bi bi-flag-fill me-1"></i> Flagged for Contractor
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="d-flex gap-3 my-2 text-muted small">
                        <span>Taste: <strong>{rev.ratings.taste}★</strong></span>
                        <span>Hygiene: <strong>{rev.ratings.hygiene}★</strong></span>
                        <span>Freshness: <strong>{rev.ratings.freshness}★</strong></span>
                        <span>Portion: <strong>{rev.ratings.portions}★</strong></span>
                      </div>

                      {rev.issues && rev.issues.length > 0 && (
                        <div className="d-flex gap-1 flex-wrap my-1">
                          {rev.issues.map((iss, i) => (
                            <span key={i} className="badge bg-danger text-white px-2 py-1 small">
                              <i className="bi bi-exclamation-triangle-fill me-1"></i> {iss}
                            </span>
                          ))}
                        </div>
                      )}

                      {rev.comment && <p className="mb-0 small text-dark mt-2 fst-italic">"{rev.comment}"</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Submit Rating Form */}
          <div className="col-lg-5">
            <div className="hcms-card p-4 sticky-top" style={{ top: "90px" }}>
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-pencil-square text-primary me-2"></i>
                  Rate Meal & Report Issue
                </h5>
                <span className="badge bg-primary text-capitalize">{activeMealSlot}</span>
              </div>

              <form onSubmit={handleSubmitReview}>
                {/* Select Meal Slot */}
                <div className="mb-3">
                  <label className="form-label small fw-bold">Select Meal</label>
                  <div className="btn-group w-100" role="group">
                    {MESS_MEALS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        className={`btn btn-sm ${
                          activeMealSlot === m.id ? "btn-primary" : "btn-outline-secondary"
                        }`}
                        onClick={() => setActiveMealSlot(m.id)}
                      >
                        {m.name.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4 Star Ratings */}
                <div className="row g-2">
                  <div className="col-6">
                    <StarRating
                      label="Taste & Spices"
                      icon="bi-heart-fill"
                      value={taste}
                      onChange={setTaste}
                    />
                  </div>
                  <div className="col-6">
                    <StarRating
                      label="Hygiene & Trays"
                      icon="bi-shield-check"
                      value={hygiene}
                      onChange={setHygiene}
                    />
                  </div>
                  <div className="col-6">
                    <StarRating
                      label="Freshness"
                      icon="bi-thermometer-sun"
                      value={freshness}
                      onChange={setFreshness}
                    />
                  </div>
                  <div className="col-6">
                    <StarRating
                      label="Portion Size"
                      icon="bi-pie-chart-fill"
                      value={portions}
                      onChange={setPortions}
                    />
                  </div>
                </div>

                {/* Common Issue Tags */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-danger">
                    <i className="bi bi-exclamation-triangle-fill me-1"></i> Report Specific Issues (Optional)
                  </label>
                  <div className="d-flex flex-wrap gap-1">
                    {MESS_ISSUE_TAGS.map((tag) => {
                      const isSelected = selectedIssues.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          className={`btn btn-xs rounded-pill px-2 py-1 small ${
                            isSelected ? "btn-danger" : "btn-outline-secondary"
                          }`}
                          style={{ fontSize: "0.78rem" }}
                          onClick={() => toggleIssueTag(tag)}
                        >
                          {isSelected && <i className="bi bi-check-lg me-1"></i>}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comment / Specific Feedback */}
                <div className="mb-3">
                  <label className="form-label small fw-bold">Feedback / Remarks</label>
                  <textarea
                    className="form-control form-control-sm"
                    rows="3"
                    placeholder="Describe food taste, cleanliness of dining tables, or water cooler status..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>

                {/* Optional Photo Proof */}
                <div className="mb-3">
                  <label className="form-label small fw-bold">
                    <i className="bi bi-camera me-1"></i> Photo Proof of Food / Utensil (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control form-control-sm"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="mt-2 text-center">
                      <img
                        src={imagePreview}
                        alt="Proof preview"
                        className="rounded-3 border"
                        style={{ maxHeight: "120px", maxWidth: "100%", objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold py-2 shadow-sm"
                  disabled={submitting}
                >
                  {submitting ? "Submitting Audit..." : "Submit Meal Rating & Review"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MessMatrix;
