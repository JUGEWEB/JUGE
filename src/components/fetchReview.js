import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./fetchReview.css";

const BASE_URL = "http://192.168.0.210:6001";

// Sample first & last names for generating real names
const firstNames = ["James", "Sophia", "Liam", "Olivia", "Noah", "Emma", "Ethan", "Ava", "Mason", "Isabella"];
const lastNames = ["Smith", "Johnson", "Brown", "Davis", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Harris"];

// Function to generate a random name
const generateRandomName = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

 // Function to process rating
 const processRating = (rating) => {
  if (!rating || rating.toLowerCase() === "n/a" || /[a-zA-Z]/.test(rating)) {
    return 5; // If rating is "N/A" or contains letters, set it to 5
  }
  const parsedRating = parseFloat(rating);
  return isNaN(parsedRating) ? 5 : parsedRating; // If it's NaN, return 5
};

const processName = (name) => {
  if (!name || name.length > 15 || name === "Unknown" || /[*@#$%^&()_+=]/.test(name)) {
    return generateRandomName();  // ✅ Call the function to return a valid name
  }
  return name;
};

const FetchReviews = ({ productId, selectedRating, onRatingClick }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reviewsRef = useRef(null); // 🔹 Create a ref


  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/get-reviews/${productId}`);
        if (response.data.success) {
          const processedReviews = response.data.reviews.map((review, index) => ({
            ...review,
            rating: processRating(review.rating),
            name: processName(review.name, index), // Ensure unique fallback names
          }));
          setReviews(processedReviews);
        } else {
          throw new Error("Failed to fetch reviews.");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  // 🔹 Scroll to reviews when a rating is clicked
  useEffect(() => {
    if (selectedRating !== null && reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedRating]);

  // Sorting logic: Move selected rating to the top
  const sortedReviews = [...reviews].sort((a, b) => {
    if (selectedRating) {
      if (parseFloat(a.rating) === selectedRating) return -1;
      if (parseFloat(b.rating) === selectedRating) return 1;
    }
    return 0;
  });

 

  return (
    <div ref={reviewsRef} className="reviews-container"> {/* 🔹 Attach ref here */}
      <h2 className="reviews-title">Customer Reviews</h2>

      {loading ? (
        <p className="loading-text">Loading reviews...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : reviews.length === 0 ? (
        <p className="no-reviews-text">No reviews yet. Be the first to review!</p>
      ) : (
        sortedReviews.map((review, index) => {
          const processedName = processName(review.name, index); // ✅ Store processed name once

          return (
            <div
              key={index}
              className="review-card"
              style={{
                border: selectedRating === parseFloat(review.rating) ? "0px solid #ddd" : "0px solid #ddd",
                backgroundColor: selectedRating === parseFloat(review.rating) ? "#fff" : "#fff",
              }}
            >
              {/* Profile Section */}
              <div className="review-header">
                <img 
                  className="profile-logo" 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(processedName)}&background=random`} 
                  alt="Profile"
                />
                <h3 className="review-author">{processedName}</h3> {/* ✅ Use stored name */}
              </div>

              <p
                className="review-rating"
                style={{
                  cursor: "pointer",
                  color: selectedRating === parseFloat(review.rating) ? "#ffcc00" : "#000",
                  fontWeight: selectedRating === parseFloat(review.rating) ? "bold" : "normal",
                }}
                onClick={() => {
                  if (typeof onRatingClick === "function") {
                    onRatingClick(processRating(review.rating));
                  }
                }}
              >
                Rating: {review.rating} ⭐
              </p>
              <p className="review-comment">{review.comment}</p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default FetchReviews;