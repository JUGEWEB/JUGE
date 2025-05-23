import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./fetchReview.css";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://api.malidag.com";

const firstNames = ["James", "Sophia", "Liam", "Olivia", "Noah", "Emma", "Ethan", "Ava", "Mason", "Isabella"];
const lastNames = ["Smith", "Johnson", "Brown", "Davis", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Harris"];

const generateRandomName = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

const processRating = (rating) => {
  if (!rating || rating.toLowerCase() === "n/a" || /[a-zA-Z]/.test(rating)) {
    return 5;
  }
  const parsed = parseFloat(rating);
  return isNaN(parsed) ? 5 : parsed;
};

const processName = (name) => {
  if (!name || name.length > 15 || name === "Unknown" || /[*@#$%^&()_+=]/.test(name)) {
    return generateRandomName();
  }
  return name;
};

const FetchReviews = ({ productId, selectedRating, onRatingClick }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reviewsRef = useRef(null);
  const location = useLocation();
  const isReviewPage = location.pathname === "/reviewPage";

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/get-reviews/${productId}`);
        if (response.data.success) {
          const processed = response.data.reviews.map((r, i) => ({
            ...r,
            rating: processRating(r.rating),
            name: processName(r.name),
          }));
          setReviews(processed);

          // ✅ Store count in localStorage for use elsewhere
          localStorage.setItem("reviewCount", processed.length);
        } else {
          throw new Error("Failed to fetch reviews.");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  useEffect(() => {
    if (selectedRating !== null && reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedRating]);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (selectedRating) {
      return parseFloat(a.rating) === selectedRating ? -1 : 1;
    }
    return 0;
  });

  const visibleReviews = isReviewPage ? sortedReviews : sortedReviews.slice(0, 11);

  return (
    <div ref={reviewsRef} className="reviews-container">
      <h2 className="reviews-title">Customer Reviews</h2>

      {loading ? (
        <p className="loading-text">Loading reviews...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : reviews.length === 0 ? (
        <p className="no-reviews-text">No reviews yet. Be the first to review!</p>
      ) : (
        <>
          {visibleReviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <img
                  className="profile-logo"
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=random`}
                  alt="Profile"
                />
                <h3 className="review-author">{review.name}</h3>
              </div>
              <p
                className="review-rating"
                style={{
                  cursor: "pointer",
                  color: selectedRating === parseFloat(review.rating) ? "#ffcc00" : "#000",
                  fontWeight: selectedRating === parseFloat(review.rating) ? "bold" : "normal",
                }}
                onClick={() => onRatingClick?.(processRating(review.rating))}
              >
                Rating: {review.rating} ⭐
              </p>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FetchReviews;
