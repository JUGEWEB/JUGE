import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from "chart.js";
import useFinalRating from "./finalRating"; // ✅ Import the custom hook
import useScreenSize from "./useIsMobile";
import "./analyseReview.css"

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const AnalyseReviewSmallWidth = ({ productId, onRatingClick, id , item, setModalOpen, onTriggerReviewNavigation  }) => {
  const [selectedRating, setSelectedRating] = useState(null);
  const { finalRating, loading, error, ratingPercentages } = useFinalRating(productId); // ✅ Use the hook
   const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall, isVeryVerySmall} = useScreenSize()
  const navigate = useNavigate();

const handleStarClick = (rating) => {
  // Just notify parent to handle the actual navigation
  if (onTriggerReviewNavigation) {
    onTriggerReviewNavigation(rating);
  }
};





  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {"★".repeat(fullStars)}
        {halfStar && "⭐"}
        {"☆".repeat(emptyStars)}
      </>
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Review Analysis</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading reviews...</p>}
      {finalRating && !loading && (
        <div style={{ maxHeight: "200px" }}>
          <h3>
            Rating: {finalRating}/5{" "}
            <span style={{ color: "#FFD700", fontSize: "24px" }}>{renderStars(finalRating)}</span>
          </h3>

          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="Stars" style={{ marginBottom: "5px", display: "flex", alignItems: "center", height:  ((isDesktop || isTablet)) ?  "30px" : "20px" }}  onClick={() => handleStarClick(star)}>
              <div
             
                style={{
                  cursor: "pointer",
                  color: selectedRating === star ? "#ffcc00" : "#000",
                  fontWeight: selectedRating === star ? "bold" : "normal",
                }}
              >
                <div style={{ display: "flex", marginRight: "5px" }}>
                  <div style={{ marginRight: "5px" }}>{star}</div> Stars:
                </div>
              </div>
              <div
             
                style={{
                  width: "100%",
                  height: "20px",
                  backgroundColor: "#ddd",
                  borderRadius: "5px",
                  cursor: "pointer",
                 
                }}
               
              >
                <div
                  style={{
                    width: `${ratingPercentages[star - 1]}%`,
                    height: "100%",
                    backgroundColor: "orange",
                    cursor: "pointer",
                    borderRadius: "5px",
                    transition: "width 1s ease-in-out",
                  }}
                />
              </div>
              <div style={{ marginLeft: "5px", cursor: "pointer" }}>
                {ratingPercentages[star - 1]}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalyseReviewSmallWidth;
