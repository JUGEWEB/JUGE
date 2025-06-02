import React, { useState, useEffect } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useScreenSize from "./useIsMobile";
import "./youMayLike.css";

const BASE_URL = "https://api.malidag.com";

function YouMayLike({ user }) {
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [userSearchHistory, setUserSearchHistory] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const navigate = useNavigate();
  const { isMobile, isDesktop, isSmallMobile, isTablet } = useScreenSize();

  const itemsPerSlide = 6;
  const stars = Math.floor(Math.random() * 5) + 1;

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

  // Fetch crypto prices
  const fetchCryptoPrices = async () => {
    try {
      const response = await fetch(`${BASE_URL}/crypto-prices`);
      const prices = await response.json();
      setCryptoPrices(prices);
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
    }
  };

  // Fetch items based on search history
  useEffect(() => {
    const fetchSuggestedItems = async () => {
      try {
        const response = await fetch(`${BASE_URL}/items`);
        const data = await response.json();

        const searchedTerms = userSearchHistory.map(s => s.search.toLowerCase());

        const matchedItems = data.items.filter(item =>
          searchedTerms.some(term =>
            item.item.name?.toLowerCase().includes(term) ||
            item.item.type?.toLowerCase().includes(term) ||
            item.category?.toLowerCase().includes(term) ||
            item.item.theme?.toLowerCase().includes(term)
          )
        );

        setSuggestedItems(matchedItems);
        await fetchCryptoPrices();
      } catch (error) {
        console.error("Error fetching suggested items:", error);
      }
    };

    if (userSearchHistory.length > 0) {
      fetchSuggestedItems();
    }
  }, [userSearchHistory]);

  const totalSlides = Math.ceil(suggestedItems.length / itemsPerSlide);
  const startIdx = currentSlide * itemsPerSlide;
  const currentItems = suggestedItems.slice(startIdx, startIdx + itemsPerSlide);

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const convertToCrypto = (usd, crypto) => {
    const price = cryptoPrices[crypto];
    if (!price) return null;
    return (parseFloat(usd) / parseFloat(price)).toFixed(2);
  };

  const handleItemClick = (id) => {
    if (id) navigate(`/product/${id}`);
  };

  return (
    <>
      {userSearchHistory.length > 0 && (
        <div className="you-may-like-carous">
          {suggestedItems.length > 0 ? (
            <>
              <div
                className="carousel-slid"
                style={{
                  overflowX: (isMobile || isSmallMobile || isTablet) ? "auto" : "hidden"
                }}
              >
                {currentItems.map((item, index) => (
                  <div className="carousel-it" key={index}>
                    <img
                      src={item.item.images[0]}
                      alt={item.item.name}
                      className="carousel-ima"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleItemClick(item.id)}
                    />
                    <div className="reconded-price">${item.item.usdPrice}</div>
                    <div className="reconded-price">
                      {item.item.usdPrice && item.item.cryptocurrency
                        ? `${convertToCrypto(item.item.usdPrice, item.item.cryptocurrency)} ${item.item.cryptocurrency}`
                        : "Price in crypto N/A"}
                    </div>
                    <div className="item-s">
                      {"★".repeat(stars)}{"☆".repeat(5 - stars)}
                    </div>
                    <p className="item-na" onClick={() => handleItemClick(item.id)}>
                      {item.item.name}
                    </p>
                  </div>
                ))}
              </div>

              {isDesktop && suggestedItems.length > itemsPerSlide && (
                <div className="carousel-arr">
                  <LeftOutlined onClick={handlePrevSlide} className="arrow-butt" />
                  <RightOutlined onClick={handleNextSlide} className="arrow-butt" />
                </div>
              )}
            </>
          ) : (
            <p style={{ padding: "1rem", color: "#777" }}>No items matched your recent searches.</p>
          )}
        </div>
      )}
    </>
  );
}

export default YouMayLike;
