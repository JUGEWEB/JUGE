import React, { useEffect, useState } from "react";
import axios from "axios";
import "./woFashion.css";
import { useNavigate } from "react-router-dom";
import RecommendedItem from "./recomendeItem";
import { useTranslation } from "react-i18next";

const BASE_URLs = "https://api.malidag.com";
const BASE_URL = "https://api.malidag.com";
const CRYPTO_URL = "https://api.malidag.com/crypto-prices";

function FashionKick() {
  const [types, setTypes] = useState({});
  const [mtypes, setMTypes] = useState({})
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();


  useEffect(() => {
    const fetchBeautyItems = async () => {
      try {
        const response = await axios.get(`${BASE_URLs}/categories/FashionKick`);
        const data = response.data;
        setMTypes(data);
      } catch (error) {
        console.error("Error fetching FashionKick categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBeautyItems();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/items`);
        const data = response.data.items;

        const filteredData = data.filter(
          (item) => item.category === "Shoes" && item.item.sold >= 100
        );

        const groupedData = filteredData.reduce((acc, item) => {
          const type = item.item.type || "Other";
          const genre = item.item.genre || "General";

          if (!acc[type]) acc[type] = {};
          if (!acc[type][genre]) acc[type][genre] = { genre, items: [] };

          acc[type][genre].items.push({ id: item.id, item: item.item });
          return acc;
        }, {});

        setTypes(groupedData);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();

    const fetchCryptoPrices = async () => {
      try {
        const response = await axios.get(CRYPTO_URL);
        setCryptoPrices(response.data);
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
      }
    };

    fetchCryptoPrices();
    const intervalId = setInterval(fetchCryptoPrices, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleItemClick = (id) => {
    if (id) navigate(`/product/${id}`);
  };

  const handleCategoryClick = (category) => {
    if (category) {
      const formattedCategory = category.toLowerCase().replace(/\s+/g, "-");
      navigate(`/itemsOfShoes/${encodeURIComponent(formattedCategory)}`);
    }
  };

  if (loading) return <div className="loading-message">Loading FashionKick Items...</div>;

  return (
    <div>

      <div className="beauty-fackik">
        {Object.values(mtypes).length === 0 ? (
          <div>No types found for Fashion category</div>
        ) : (
          Object.values(mtypes).map((typeObj, index) => (
            <div key={index} className="type-section">
              <div className="type-image-id">
                <img
                  src={typeObj.image}
                  alt={typeObj.type}
                  className="type-image-imgid"
                  onClick={() => handleCategoryClick(typeObj.type)}
                />
              </div>
              <h3
                className="type-title"
                style={{
                  color: "green",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "20px"
                }}
              >
                {t(typeObj.type)}
              </h3>
            </div>
          ))
        )}
      </div>

     <div
  style={{
    display: "flex",
    overflowX: "auto",
    gap: "12px",
    padding: "10px 15px",
    marginBottom: "20px",
    scrollbarWidth: "none"
  }}
>
  {Object.entries(types).flatMap(([type, genres]) =>
    Object.keys(genres).map((genre) => (
      <div
        key={`${type}-${genre}`}
        style={{
          flex: "0 0 auto",
          width: "160px",
          height: "100px",
          backgroundImage: `url('https://api.malidag.com/images/1752763495656-steptodown.com390802.webp')`, // ✅ your image link
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "10px",
          position: "relative",
          cursor: "pointer",
          color: "#fff",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textShadow: "0 2px 4px rgba(0,0,0,0.7)"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            borderRadius: "10px"
          }}
        />
        <span style={{ position: "relative", zIndex: 1 }}>
          {t("top_items")}: {t(type) || type}
        </span>
      </div>
    ))
  )}
</div>


      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "12px",
          padding: "10px 15px"
        }}
      >
        {Object.values(types)
          .flatMap((genreMap) => Object.values(genreMap))
          .flatMap((genreObj) => genreObj.items)
          .map(({ id, item }) => (
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
                alignItems: "center"
              }}
            >
              <img
                src={item?.images?.[0]}
                alt={item?.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "contain",
                  marginBottom: "8px"
                }}
              />
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginBottom: "4px",
                  color: "#333"
                }}
              >
                ${item?.usdPrice}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#555",
                  textAlign: "center"
                }}
              >
                {item?.name?.length > 60
                  ? `${item.name.substring(0, 60)}...`
                  : item?.name}
              </div>
            </div>
          ))}
      </div>

     
       
  <RecommendedItem />
    
    </div>
  );
}

export default FashionKick;
