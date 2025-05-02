import React, { useEffect, useState } from "react";
import axios from "axios";
import "./payBNBBTCETH.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://api.malidag.com";
const CRYPTO_URL = "https://api.malidag.com/crypto-prices";

function PayBBE() {
  const [types, setTypes] = useState({});
  const [selectedType, setSelectedType] = useState(null);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilteredItems = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/items`);
        const data = response.data.items;

        const filteredData = data.filter((item) => {
          const usdPrice = parseFloat(item.item.usdPrice);
          const originalPrice = parseFloat(item.item.originalPrice);
          const discount = originalPrice > 0 ? (originalPrice - usdPrice) / originalPrice : 0;

          return (
            ["BNB", "BTC", "ETH"].includes(item.item.cryptocurrency) &&
            discount <= 0.5
          );
        });

        const groupedData = filteredData.reduce((acc, item) => {
          const type = item.item.type || "Other";
          if (!acc[type]) acc[type] = [];
          acc[type].push(item);
          return acc;
        }, {});

        setTypes(groupedData);
        const firstType = Object.keys(groupedData)[0];
        setSelectedType(firstType); // select first by default
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCryptoPrices = async () => {
      try {
        const response = await axios.get(CRYPTO_URL);
        setCryptoPrices(response.data);
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
      }
    };

    fetchFilteredItems();
    fetchCryptoPrices();
    const intervalId = setInterval(fetchCryptoPrices, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const convertToCrypto = (usdPrice, cryptocurrency) => {
    if (!cryptoPrices[cryptocurrency]) return null;
    return (usdPrice / cryptoPrices[cryptocurrency]).toFixed(2);
  };

  const getCryptoIcon = (cryptocurrency) => {
    const cryptoIcons = {
      ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
      USDC: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
      BUSD: "https://assets.coingecko.com/coins/images/9576/large/BUSD.png?1568947766",
      SOL: "https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422",
      BNB: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615",
      USDT: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
    };
    return cryptoIcons[cryptocurrency] || "/crypto-icons/default.png";
  };

  const renderStars = (rating) => {
    return (
      <div className="stars-container">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < rating ? "star filled" : "star empty"}>★</span>
        ))}
      </div>
    );
  };

  const handleItemClick = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) return <div className="loading-message">Loading Items...</div>;

  return (
    <div className="bbe-container">
      {/* Type List */}
      <div className="bbe-type-list">
        {Object.keys(types).map((type) => (
          <div
            key={type}
            className={`bbe-type-item ${selectedType === type ? "active" : ""}`}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </div>
        ))}
      </div>

      {/* Items for selected type */}
      <div className="bbe-item-grid">
        {types[selectedType]?.map(({ id, item }) => (
          <div key={id} className="bbe-item-card">
            <div style={{backgroundColor: "white",  filter: "brightness(0.880000000) contrast(1.2)"}}>
            <img
              src={item.images[0]}
              alt={item.name}
              onClick={() => handleItemClick(id)}
              className="bbe-item-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/fallback.png";
              }}
            />
            </div>
            <div className="bbe-item-info" onClick={() => handleItemClick(id)}>
              <div className="bbe-item-price">
                ${item.usdPrice}
                <span className="crypto-price">
                  {convertToCrypto(item.usdPrice, item.cryptocurrency)} {item.cryptocurrency}
                  <img
                    src={getCryptoIcon(item.cryptocurrency)}
                    className="crypto-icon"
                    alt={item.cryptocurrency}
                  />
                </span>
              </div>
              <div className="bbe-item-name">
                {item.name.length > 100 ? `${item.name.slice(0, 100)}...` : item.name}
              </div>
              <div className="bbe-item-rating">{renderStars(item.rating || 0)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PayBBE;
