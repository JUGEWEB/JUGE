import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import React Router's navigate hook
import axios from "axios";
import useScreenSize from "./useIsMobile";
import "./type.css";

const Type = () => {
  const navigate = useNavigate(); // Use the navigate hook
  const {isMobile, isDesktop, isTablet} = useScreenSize()

  // Handle navigation when a type is clicked
  const handleTypeClick = () => {
    navigate(`/items`);
  };

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
