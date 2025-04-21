import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import React Router's navigate hook
import axios from "axios";
import useScreenSize from "./useIsMobile";
import { useLocation } from "react-router-dom";
import "./type.css";

const Type = () => {
  const navigate = useNavigate(); // Use the navigate hook
  const {isMobile, isDesktop, isTablet, isSmallMobile, isVerySmall} = useScreenSize()
  const location = useLocation()

  // Handle navigation when a type is clicked
  const handleTypeClick = () => {
    navigate(`/items`);
  };

   // ✅ Hide if mobile/small/verySmall and route is not home
 if (
  (isMobile || isSmallMobile || isVerySmall) &&
  location.pathname !== "/"
) {
  return null;
}

  return (
    <div className="type-scroll-container"style={{marginLeft: (isDesktop || isTablet) ? "0px" : "20px", width: (isDesktop || isTablet) ? "60%" : "100%"}}>
      <div className="type-scroll">
          <div
          className="type-item"
          onClick={handleTypeClick}
          >
            New
          </div>
          <div
          className="type-itemT"
          >
            The crypto shop
          </div>
      </div>
    </div>
  );
};

export default Type;
