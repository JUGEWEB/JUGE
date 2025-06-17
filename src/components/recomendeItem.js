import React, { useState, useEffect } from "react";
import "./recomendedItem.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const BASE_URL = "https://api.malidag.com"; // Replace with your actual API URL
const BASE_URLs = "https://api.malidag.com"; // Replace with your actual API URL

function RecommendedItem() {
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [expandedItemId, setExpandedItemId] = useState(null); // Track expanded item
  const navigate = useNavigate(); // Initialize navigate
  const [reviews, setReviews] = useState({});

 // Fetch cryptocurrency prices from the new endpoint
 const fetchCryptoPrices = async () => {
  try {
    const response = await fetch(`${BASE_URLs}/crypto-prices`);
    const prices = await response.json();
    setCryptoPrices(prices);
  } catch (error) {
    console.error("Error fetching crypto prices:", error);
  }
};

const fetchReviews = async (productId) => {
    try {
      const response = await axios.get(`${BASE_URL}/get-reviews/${productId}`);
      if (response.data.success) {
        const reviewsArray = response.data.reviews || [];
        const totalRating = reviewsArray.reduce((acc, review) => {
          const rating = parseFloat(review.rating);
          return acc + (isNaN(rating) ? 4 : rating);
        }, 0);
        const averageRating = reviewsArray.length
          ? (totalRating / reviewsArray.length).toFixed(2)
          : null;

        setReviews((prev) => ({
          ...prev,
          [productId]: { averageRating, reviewsArray },
        }));
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    const fetchRecommendedItems = async () => {
      try {
        const response = await fetch(`${BASE_URL}/items`);
        const data = await response.json();

        // Filter items between $1 and $50
        const filteredItems = data.items.filter((item) => {
          const price = parseFloat(item.item.usdPrice);
          return price >= 1 && price <= 50;
        });

        // Shuffle items and select the first 30
        const shuffledItems = filteredItems.sort(() => 0.5 - Math.random());
        const selectedItems = shuffledItems.slice(0, 30);

        setRecommendedItems(selectedItems);

        await Promise.all(selectedItems.map((item) => fetchReviews(item.itemId)));

        const symbols = [
          ...new Set(
            selectedItems
              .map((item) => item.item.cryptocurrency && `${item.item.cryptocurrency}`)
              .filter(Boolean)
          ),
        ];

        await fetchCryptoPrices(symbols);

      } catch (error) {
        console.error("Error fetching recommended items:", error);
      }
    };

    fetchRecommendedItems();
  }, []);

  // Helper function to convert USD price to cryptocurrency price
  const convertToCrypto = (usdPrice, crypto) => {
    if (!cryptoPrices[crypto]) return null; // If the price isn't available
    const cryptoPrice = parseFloat(cryptoPrices[crypto]); // Price in USD per 1 unit of crypto
    return (usdPrice / cryptoPrice).toFixed(2); // USD to crypto conversion
  };

  
  const toggleDetails = (itemId) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId); // Toggle view
  };

  // Handle item click to navigate to product details page
  const handleItemClick = (id) => {
    if (id) {
      navigate(`/product/${id}`); // Navigate to the product details page
    }
  };

         
  return (
    <div className="recommended-items-container">
      <h2 className="recommended-title">Recommended Products</h2>
      <div className="recommended-grid">
        {recommendedItems.map((item) => {

          const ratingObj = reviews[item.itemId];
          const averageRating = ratingObj ? ratingObj.averageRating : null;

           return (
          <div className="recommended-item" key={item.id}>
            <div className="rec-img">
            <img
              src={item.item.images[0]} // Assuming the first image is the main image
              alt={item.item.name}
              className="recommended-image"
              onClick={() => handleItemClick(item.id)} // Pass the correct id
            />
            </div>
            <div className="recommended-info">
              <p  onClick={() => handleItemClick(item.id)} className="recommended-name">{item.item.name}</p>
              <div className="item-sta">
                  {averageRating
                    ? "★".repeat(Math.round(averageRating)) +
                      "☆".repeat(5 - Math.round(averageRating))
                    : "No rating"}
                </div>
              <div className="recommended-price">${item.item.usdPrice}</div>
              <div style={{display: 'flex', alignItems: 'center'}}>
              <div className="recommended-price">
             
                  {item.item.usdPrice && item.item.cryptocurrency
                    ? `${convertToCrypto(Number(item.item.usdPrice), item.item.cryptocurrency)} ${item.item.cryptocurrency}`
                    : "Price in crypto N/A"}
                </div>
             <div style={{color: '#cf7704', fontSize: '14px', marginLeft: '10px', cursor: 'pointer'}}  onClick={() => toggleDetails(item.id)}>view  price</div>
             </div>
             {expandedItemId === item.id && (
                 <div className="recommended-pi">
                {cryptoPrices[item.item.cryptocurrency]
                  ? `1 ${item.item.cryptocurrency} = $${cryptoPrices[item.item.cryptocurrency].toFixed(5)} 
                    `
                  : "N/A"}
              </div>
              )}
            </div>
          </div>
           );
})}
      </div>
    </div>
  );
}

export default RecommendedItem;
