import React, { useState, useEffect } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons"; // Import arrow icons from Ant Design
import "./electronic.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import useScreenSize from "./useIsMobile";

const BASE_URL = "http://192.168.0.210:3001"; // Replace with your actual API URL
const ITEMS_PER_SLIDE = 6; // Number of items to display per slide
const MAX_ITEMS = 17; // Maximum number of items to fetch/display

function Electronic() {
  const [items, setItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate(); // Initialize the useNavigate hook
   const {isMobile, isDesktop, isSmallMobile, isVerySmall, isTablet} = useScreenSize()


  useEffect(() => {
    const fetchFashionItems = async () => {
      try {
        const response = await fetch(`${BASE_URL}/items`);
        const data = await response.json();

        // Filter items with "fashion" in the category or theme
        const fashionItems = data.items.filter((item) => {
          const category = item.category?.toLowerCase() || "";
          const theme = item.item?.theme?.toLowerCase() || "";
          const genre = item.item?.genre?.toLowerCase() || "";
          return category.includes("electronic") || theme.includes("electronic") || genre.includes("electronic");
        });

        // Limit to max items and set state
        setItems(fashionItems.slice(0, MAX_ITEMS));
      } catch (error) {
        console.error("Error fetching fashion items:", error);
      }
    };

    fetchFashionItems();
  }, []);

  // Calculate total slides
  const totalSlides = Math.ceil(items.length / ITEMS_PER_SLIDE);

  // Get items for the current slide
  const startIndex = currentSlide * ITEMS_PER_SLIDE;
  const endIndex = startIndex + ITEMS_PER_SLIDE;
  const currentItems = items.slice(startIndex, endIndex);

  // Navigation handlers
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

   // Handle item click to navigate to product details page
   const handleItemClick = (id) => {
    if (id) {
      navigate(`/product/${id}`); // Navigate to the product details page
    }
  };

  return (
    <div className="fashion-carousel">
      <div className="carousel-slides"  style={{overflowX: (isMobile || isSmallMobile || isTablet) ? "auto" : ""}}>
        {currentItems.map((item, index) => (
          <div key={item.id || index} className="carousel-item"  style={{overflowX: (isMobile || isSmallMobile || isTablet || isVerySmall) ? "auto" : "", padding:  (isSmallMobile || isVerySmall) ? "0px" : "2px" , width:  (isSmallMobile || isVerySmall) ? "calc(100% / 2)" : (isTablet || isMobile) ? "calc(100% / 4)" : "calc(100% / 6)"  }}>
            <img
              src={item.item?.images[0]} // Display the first image of each item
              alt={item.item?.name || "Fashion Item"}
              className="carousel-imageof"
              onClick={() => handleItemClick(item.id)} // Attach the click handle
            />
            
          </div>
        ))}
      </div>
      {(!(isMobile || !isTablet || isSmallMobile || isVerySmall)) && (
           <div className="carousel-arrows">
                   <LeftOutlined onClick={handlePrevSlide} className="arrow-button" />
                   <RightOutlined onClick={handleNextSlide} className="arrow-button" />
                 </div>
                  )}
    </div>
  );
}

export default Electronic;
