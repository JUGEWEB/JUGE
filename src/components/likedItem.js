import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./LikedItems.css";

const BASE_URL = "http://192.168.0.210:3018";

const LikedItems = ({ auth }) => {
  const [likedItems, setLikedItems] = useState([]);
  const userId = auth?.currentUser?.uid || "guest"; // Use a default user ID if not logged in
  const navigate = useNavigate(); // Initialize navigation
  const location = useLocation(); // ✅ Get current route
  const isLikedPage = location.pathname === "/likeditem"; // ✅ Check if on Liked Items page

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
      {likedItems.length === 0 ? (
        <p>No liked items yet.</p>
      ) : (
        (isLikedPage ? likedItems : likedItems.slice(0, 5)).map((item) => (
          <div key={item.id} className="liked-item" style={{ display: isLikedPage ? "flex" : "" }}>
            {/* Clicking image navigates to product page */}
            <div style={{ height: "300px", width: "300px", filter: "brightness(0.95)", backgroundColor: "white" }}>
              <img
                src={item.image}
                alt={item.name}
                className="liked-item-image"
                onClick={() => handleNavigate(item.id)}
              />
            </div>

            {/* Clicking name navigates to product page */}
            <p className="liked-item-name" onClick={() => handleNavigate(item.id)}>
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
  );
};

export default LikedItems;
