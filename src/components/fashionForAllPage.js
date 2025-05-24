import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./itemPage.css";
import useScreenSize from "./useIsMobile";

function ItemFashionPage() {
  const [brandGroups, setBrandGroups] = useState([]);
  const [topItemsPerBrand, setTopItemsPerBrand] = useState({});
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState({}); // Store reviews data
              const {isMobile, isDesktop, isTablet, isSmallMobile, isVerySmall, isVeryVerySmall} = useScreenSize()
    const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          `https://api.malidag.com/api/categories/clothing/brands`
        );
        const brands = response.data?.brands || [];
        setBrandGroups(brands);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchTopItems = async () => {
      const itemsMap = {};
      const allSymbols = new Set();

      await Promise.all(
        brandGroups.map(async (group) => {
          const brandName = group.brand;
          try {
            const response = await axios.get(
              `https://api.malidag.com/api/brands/${encodeURIComponent(
                brandName
              )}/top-items`
            );
            itemsMap[brandName] = response.data;

            response.data.forEach((item) => {
              if (item.cryptocurrency) {
                allSymbols.add(item.cryptocurrency);
              }
            });
          } catch (error) {
            console.warn(`Failed to fetch top items for ${brandName}`);
          }
        })
      );

      setTopItemsPerBrand(itemsMap);
      fetchCryptoPrices([...allSymbols]);
      setLoading(false);
    };

    if (brandGroups.length > 0) {
      fetchTopItems();
    }
  }, [brandGroups]);

  const fetchCryptoPrices = async (symbols) => {
    try {
      const response = await axios.get("https://api.malidag.com/crypto-prices");
      const prices = symbols.reduce((acc, symbol) => {
        if (response.data[symbol]) {
          acc[symbol] = parseFloat(response.data[symbol]);
        }
        return acc;
      }, {});
      setCryptoPrices(prices);
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
    }
  };

  const handleItemClick = (id) => {
    if (id) navigate(`/product/${id}`);
  };

  if (loading) return <div className="loading-message">Loading...</div>;

  return (
    <div >
      {Object.entries(topItemsPerBrand).map(([brand, items]) => (
          <div style={{
  display: "grid",
  width: "100%",
  maxWidth: "100%",
  gap: "5px",
  padding: "5px",
  gridTemplateColumns:
    isVerySmall
      ? "repeat(2, 1fr)"
      : isVeryVerySmall
      ? "repeat(1, 1fr)"
      : isSmallMobile
      ? "repeat(2, 1fr)"
      : isMobile
      ? "repeat(3, 1fr)"
      : isTablet
      ? "repeat(3, 1fr)"
      : "repeat(3, 1fr)"}}>
            {items.map((item) => {
              const crypto = item.cryptocurrency || "";
              const cryptoPrice = cryptoPrices[crypto] || 0;
              const priceInCrypto = cryptoPrice > 0 ? (item.usdPrice / cryptoPrice).toFixed(6) : "N/A";
              const stars = Math.floor(Math.random() * 5) + 1;

              return (
                <div key={item.id}  onClick={() => handleItemClick(item.id)}>
                   <div
                style={{
                  background: 'white',
                  zIndex: '1',
                 paddingTop: "20px",
                 filter: "brightness(0.880000000) contrast(1.2)",
                  width: '100%',
                  height:(isVerySmall) ? "230px" :  "300px",
                  marginBottom: '10px',
                  marginTop: '10px',
                  position: 'relative',
                }}
              >
                  <img src={item.images[0]} alt={item.name} className="item-image" />
                  </div>
                  <div className="item-name">{item.name.length > 20 ? item.name.slice(0, 20) + "..." : item.name}</div>
                  <div className="item-price">${item.usdPrice}</div>
                  <div className="item-crypto">
                    <img
                      src={`https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/svg/color/${crypto.toLowerCase()}.svg`}
                      alt={crypto}
                      className="crypto-icon"
                      onError={(e) => (e.target.src = "https://cryptologos.cc/logos/binance-usd-busd-logo.png")}
                    />
                    <span className="item-crypto-price">
                      {priceInCrypto !== "N/A" ? `${priceInCrypto} ${crypto}` : "Price unavailable"}
                    </span>
                  </div>
                  <div className="item-sold">{item.sold} sold</div>
                  <div className="item-stars">{"★".repeat(stars)}{"☆".repeat(5 - stars)}</div>
                </div>
              );
            })}
          </div>
        
      ))}
    </div>
  );
}

export default ItemFashionPage;
