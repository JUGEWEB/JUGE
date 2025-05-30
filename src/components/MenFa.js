import React, { useEffect, useState } from "react";
import axios from "axios";
import "./woFashion.css";
import { useNavigate } from "react-router-dom";
import RecommendedItem from "./personalRecommend";

const BASE_URLs = "https://api.malidag.com";
const BASE_URL = "https://api.malidag.com";
const CRYPTO_URL = "https://api.malidag.com/crypto-prices";

function MenFashion() {
  const [types, setTypes] = useState({});
  const [mtypes, setMTypes] = useState({});
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenFashionTypes = async () => {
      try {
        const res = await axios.get(`${BASE_URLs}/categories/MenFashion`);
        setMTypes(res.data);
      } catch (error) {
        console.error("Error fetching men fashion types:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenFashionTypes();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/items`);
        const menItems = res.data.items.filter(
          (item) => item.item.genre.includes("men") && item.category !== "Beauty"
        );

        const grouped = menItems.reduce((acc, item) => {
          const type = item.item.type || "Other";
          if (!acc[type]) acc[type] = [];
          acc[type].push(item);
          return acc;
        }, {});

        setTypes(grouped);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    const fetchCryptoPrices = async () => {
      try {
        const res = await axios.get(CRYPTO_URL);
        setCryptoPrices(res.data);
      } catch (err) {
        console.error("Crypto price fetch failed:", err);
      }
    };

    fetchItems();
    fetchCryptoPrices();

    const interval = setInterval(fetchCryptoPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  const convertToCrypto = (usd, crypto) => {
    return cryptoPrices[crypto] ? (usd / cryptoPrices[crypto]).toFixed(2) : null;
  };

  const handleItemClick = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) return <div className="loading-message">Loading Men Fashion...</div>;

  return (
    <div className="personal-care-container">
      {/* Horizontal scroll of types */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "12px",
          padding: "10px 15px",
          marginBottom: "20px",
          scrollbarWidth: "none",
        }}
        className="top-type-scroll"
      >
        {Object.keys(types).map((type, idx) => (
          <div
            key={idx}
            onClick={() => navigate(`/men-top-topic/${type.toLowerCase()}`)}
            style={{
              flex: "0 0 auto",
              background: "#f0f0f0",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#333",
              whiteSpace: "nowrap",
            }}
          >
            Top {type}
          </div>
        ))}
      </div>

      {/* Product grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "12px",
          padding: "10px 15px",
        }}
      >
        {Object.values(types).flat().map(({ id, item }) => (
          <div
            key={id}
            onClick={() => handleItemClick(id)}
            style={{
              background: "#fff",
              padding: "10px",
              border: "1px solid #eee",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={item.images[0]}
              alt={item.name}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "contain",
                marginBottom: "8px",
              }}
            />
            <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "4px", color: "#333" }}>
              ${item.usdPrice}
            </div>
            <div style={{ fontSize: "12px", color: "#555", textAlign: "center" }}>
              {item.name.length > 60 ? `${item.name.substring(0, 60)}...` : item.name}
            </div>
          </div>
        ))}
      </div>

      <div style={{ width: "100%" }}>
        <RecommendedItem />
      </div>
    </div>
  );
}

export default MenFashion;
