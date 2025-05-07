import React, { useState, useEffect } from "react";
import "./recomendedItem.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const BASE_URL = "https://api.malidag.com"; // Replace with your actual API URL
const BASE_URLs = "https://api.malidag.com"; // Replace with your actual API URL

function Browsing({ user }) {
  const [userSearchHistory, setUserSearchHistory] = useState([]);
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [expandedItemId, setExpandedItemId] = useState(null); // Track expanded item
  const [loading, setLoading] = useState(true); // Loading state
  const stars = Math.floor(Math.random() * 5) + 1; // Random stars for now
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Fetch cryptocurrency prices
  const fetchCryptoPrices = async (symbols) => {
    try {
      const response = await fetch(`${BASE_URLs}/crypto-prices`);
      const prices = await response.json();
      setCryptoPrices(prices);
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
    }
  };

  useEffect(() => {
    const fetchUserSearchHistory = async () => {
      try {
        const response = await fetch(`${BASE_URL}/search-items?userId=${user?.uid}`);
        const data = await response.json();
        setUserSearchHistory(data?.userSearches || []);
      } catch (error) {
        console.error("Error fetching user search history:", error);
      }
    };

    const fetchSuggestedItems = async () => {
      try {
        const response = await fetch(`${BASE_URL}/items`);
        const data = await response.json();

        // Extract categories from search history
        const searchedCategories = userSearchHistory.map((search) =>
          search.search?.toLowerCase()
        );

        // Filter items based on search history categories
        const matchedItems = data.items.filter((item) =>
          searchedCategories.includes(item.category?.toLowerCase())
        );

        const symbols = [
          ...new Set(
            matchedItems
              .map((item) => item.item.cryptocurrency && `${item.item.cryptocurrency}`)
              .filter(Boolean)
          ),
        ];

        await fetchCryptoPrices(symbols);

        setSuggestedItems(matchedItems);
      } catch (error) {
        console.error("Error fetching suggested items:", error);
      } finally {
        setLoading(false); // Stop loading after data fetch
      }
    };

    if (user?.uid) {
      fetchUserSearchHistory().then(() => {
        if (userSearchHistory.length > 0) {
          fetchSuggestedItems();
        } else {
          setLoading(false); // Stop loading if no search history
        }
      });
    } else {
      setLoading(false); // Stop loading if user not logged in
    }
  }, [user?.uid, userSearchHistory]);

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
      <h2 className="recommended-title">Based on your Browsing</h2>
      {loading ? (
        <div className="loading-indicator">Loading...</div>
      ) : suggestedItems.length > 0 ? (
        <div className="recommended-grid">
          {suggestedItems.map((item) => (
            <div className="recommended-item" key={item.id}>
              <div className="rec-img">
                <img
                  src={item.item.images[0]} // Assuming the first image is the main image
                  alt={item.item.name}
                  onClick={() => handleItemClick(item.id)} // Attach the click handle
                  className="recommended-image"
                />
              </div>
              <div className="recommended-info">
                <p  onClick={() => handleItemClick(item.id)}  className="recommended-name">{item.item.name}</p>
                <div className="item-sta">
                  {"★".repeat(stars)}{"☆".repeat(5 - stars)}
                </div>
                <div className="recommended-price">${item.item.usdPrice}</div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="recommended-price">
                    {item.item.usdPrice && item.item.cryptocurrency
                      ? `${convertToCrypto(
                          Number(item.item.usdPrice),
                          item.item.cryptocurrency
                        )} ${item.item.cryptocurrency}`
                      : "Price in crypto N/A"}
                  </div>
                  <div
                    style={{
                      color: "#cf7704",
                      fontSize: "14px",
                      marginLeft: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleDetails(item.id)}
                  >
                    view price
                  </div>
                </div>
                {expandedItemId === item.id && (
                  <div className="recommended-pi">
                    {cryptoPrices[item.item.cryptocurrency]
                      ? `1 ${item.item.cryptocurrency} = $${cryptoPrices[
                          item.item.cryptocurrency
                        ].toFixed(5)}`
                      : "N/A"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-items">No recommendations found for your search history.</div>
      )}
    </div>
  );
}

export default Browsing;
