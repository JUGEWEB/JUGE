import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./LikedItems.css";
import useScreenSize from "./useIsMobile";

const BASE_URL = "https://api.malidag.com";

const LikedItems = ({ auth }) => {
  const [likedItems, setLikedItems] = useState([]);
  const userId = auth?.currentUser?.uid || "guest"; // Use a default user ID if not logged in
  const navigate = useNavigate(); // Initialize navigation
  const location = useLocation(); // ✅ Get current route
  const isLikedPage = location.pathname === "/likeditem"; // ✅ Check if on Liked Items page
  const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall} = useScreenSize()

  // 🔹 Fetch liked items when component mounts
  useEffect(() => {
    if (userId) {
      fetchLikedItems();
    }
  }, [userId]);

  const fetchLikedItems = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/liked-items/${userId}`);
      setLikedItems(response.data.likedItems || []);
    } catch (error) {
      console.error("Error fetching liked items:", error);
    }
  };

  // 🔹 Navigate to product page
  const handleNavigate = (itemId) => {
    navigate(`/product/${itemId}`);
  };

  // 🔹 Handle removing an item from liked list
  const handleRemoveLike = async (itemId) => {
    try {
      await axios.delete(`${BASE_URL}/remove-from-liked/${userId}/${itemId}`);
      setLikedItems(likedItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error removing liked item:", error);
    }
  };

  return (
    <div className="liked-container">
      <h2>What you like</h2>
      <div style={{display: (!(isDesktop || isTablet || isLikedPage)) ? "flex" : "", overflowX: (!(isDesktop || isTablet || isLikedPage)) ? "auto" : "", justifyContent: (!(isDesktop || isTablet || isLikedPage)) ? "start" : ""}}>
      {likedItems.length === 0 ? (
        <p>No liked items yet.</p>
      ) : (
        (isLikedPage ? likedItems : likedItems.slice(0, 5)).map((item) => (
          <div key={item.id} className="liked-item" style={{ display: isLikedPage ? "flex" : "", padding: "2px" }}>
            {/* Clicking image navigates to product page */}
            <div style={{ height:(!(isDesktop || isTablet || isLikedPage)) ? "100px" : "300px", width:(!(isDesktop || isTablet || isLikedPage)) ? "100px" : "300px", filter: "brightness(0.95)", backgroundColor: "white" }}>
              <img
                src={item.image}
                alt={item.name}
                className="liked-item-image"
                onClick={() => handleNavigate(item.id)}
                style={{height:(!(isDesktop || isTablet || isLikedPage)) ? "100px" : "300px"}}
              />
            </div>

            {/* Clicking name navigates to product page */}
            <p className="liked-item-name" style={{maxWidth:(!(isDesktop || isTablet || isLikedPage)) ? "100px" : "300px", maxHeight:(!(isDesktop || isTablet || isLikedPage)) ? "100px" : "300px",  textOverflow: "ellipsis",whiteSpace: "nowrap",
    overflow: "hidden",  }} onClick={() => handleNavigate(item.id)}>
              {item.name} - ${item.price}
            </p>

            {/* ✅ Show Remove button only if on /likedItem page */}
            {isLikedPage && (
              <button onClick={() => handleRemoveLike(item.id)} className="remove-btn">
                Remove
              </button>
            )}
          </div>
        ))
      )}
      </div>
    </div>
  );
};

export default LikedItems;
