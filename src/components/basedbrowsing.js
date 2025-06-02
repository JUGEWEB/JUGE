import React, { useState, useEffect } from "react";
import "./recomendedItem.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://api.malidag.com";

function Browsing({ user }) {
  const [userSearchHistory, setUserSearchHistory] = useState([]);
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [loading, setLoading] = useState(true);
  const stars = Math.floor(Math.random() * 5) + 1;
  const navigate = useNavigate();

  // Fetch user search history
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

    if (user?.uid) {
      fetchUserSearchHistory();
    }
  }, [user?.uid]);

  // Fetch suggested items and crypto prices after history is available
  useEffect(() => {
    const fetchSuggestedItems = async () => {
      try {
        const response = await fetch(`${BASE_URL}/items`);
        const data = await response.json();

        const terms = userSearchHistory.map(s => s.search.toLowerCase());

        const matchedItems = data.items.filter(item =>
          terms.some(term =>
            item.item.name?.toLowerCase().includes(term) ||
            item.item.type?.toLowerCase().includes(term) ||
            item.category?.toLowerCase().includes(term) ||
            item.item.theme?.toLowerCase().includes(term)
          )
        );

        setSuggestedItems(matchedItems);

        const symbols = [
          ...new Set(
            matchedItems
              .map((item) => item.item.cryptocurrency && `${item.item.cryptocurrency}`)
              .filter(Boolean)
          ),
        ];

        await fetchCryptoPrices(symbols);
      } catch (error) {
        console.error("Error fetching suggested items:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCryptoPrices = async () => {
      try {
        const response = await fetch(`${BASE_URL}/crypto-prices`);
        const prices = await response.json();
        setCryptoPrices(prices);
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
      }
    };

    if (userSearchHistory.length > 0) {
      fetchSuggestedItems();
    } else {
      setLoading(false);
    }
  }, [userSearchHistory]);

  const convertToCrypto = (usdPrice, crypto) => {
    if (!cryptoPrices[crypto]) return null;
    return (usdPrice / parseFloat(cryptoPrices[crypto])).toFixed(2);
  };

  const toggleDetails = (itemId) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
  };

  const handleItemClick = (id) => {
    if (id) navigate(`/product/${id}`);
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
                  src={item.item.images[0]}
                  alt={item.item.name}
                  onClick={() => handleItemClick(item.id)}
                  className="recommended-image"
                />
              </div>
              <div className="recommended-info">
                <p className="recommended-name" onClick={() => handleItemClick(item.id)}>
                  {item.item.name}
                </p>
                <div className="item-sta">
                  {"★".repeat(stars)}{"☆".repeat(5 - stars)}
                </div>
                <div className="recommended-price">${item.item.usdPrice}</div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="recommended-price">
                    {item.item.usdPrice && item.item.cryptocurrency
                      ? `${convertToCrypto(item.item.usdPrice, item.item.cryptocurrency)} ${item.item.cryptocurrency}`
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
                      ? `1 ${item.item.cryptocurrency} = $${cryptoPrices[item.item.cryptocurrency].toFixed(5)}`
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
