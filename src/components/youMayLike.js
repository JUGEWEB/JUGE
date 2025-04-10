import React, { useState, useEffect } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./youMayLike.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import useScreenSize from "./useIsMobile";

const BASE_URL = "http://192.168.0.210:3001";
const BASE_URLs = "http://192.168.0.210:2000"; // Replace with your actual API URL

function YouMayLike({ user }) {
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [userSearchHistory, setUserSearchHistory] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const stars = Math.floor(Math.random() * 5) + 1; // Random stars for now
  const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall} = useScreenSize()
  const navigate = useNavigate(); // Initialize navigate

  const itemsPerSlide = 6;

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
      }
    };

    if (user?.uid) {
      fetchUserSearchHistory().then(() => {
        if (userSearchHistory.length > 0) {
          fetchSuggestedItems();
        }
      });
    }
  }, [user?.uid, userSearchHistory]);

  const totalSlides = Math.ceil(suggestedItems.length / itemsPerSlide);

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? totalSlides - 1 : prevSlide - 1
    );
  };

  const startIdx = currentSlide * itemsPerSlide;
  const currentItems = suggestedItems.slice(startIdx, startIdx + itemsPerSlide);

  // Helper function to convert USD price to cryptocurrency price
  const convertToCrypto = (usdPrice, crypto) => {
    if (!cryptoPrices[crypto]) return null; // If the price isn't available
    const cryptoPrice = parseFloat(cryptoPrices[crypto]); // Price in USD per 1 unit of crypto
    return (usdPrice / cryptoPrice).toFixed(2); // USD to crypto conversion
  };

  // Handle item click to navigate to product details page
  const handleItemClick = (id) => {
    if (id) {
      navigate(`/product/${id}`); // Navigate to the product details page
    }
  };

  return (
    <>
      {userSearchHistory.length > 0 && suggestedItems.length > 0 && (
        <div className="you-may-like-carous">
          <div className="carousel-slid"  style={{overflowX: (isMobile || isSmallMobile || isTablet) ? "auto" : ""}}>
            {currentItems.map((item, index) => (
              <div className="carousel-it" key={index}>
                <div>
                <img
                  src={item.item.images[0]}
                  alt={item.item.name}
                  onClick={() => handleItemClick(item.id)} // Pass the correct id
                  className="carousel-ima"
                  style={{cursor: "pointer"}}
                />
              </div>
              <div className="reconded-price">${item.item.usdPrice}</div>
              <div className="reconded-price">
             
             {item.item.usdPrice && item.item.cryptocurrency
               ? `${convertToCrypto(Number(item.item.usdPrice), item.item.cryptocurrency)} ${item.item.cryptocurrency}`
               : "Price in crypto N/A"}
           </div>
              <div className="item-s">
                  {"★".repeat(stars)}{"☆".repeat(5 - stars)}
                </div>
               <p className="item-na"  onClick={() => handleItemClick(item.id)} >{item.item.name}</p>
               </div>
            ))}
          </div>
          {(isDesktop) && (
        
          <div>
          {suggestedItems.length > itemsPerSlide && (
            <div className="carousel-arr">
              <LeftOutlined onClick={handlePrevSlide} className="arrow-butt" />
              <RightOutlined onClick={handleNextSlide} className="arrow-butt" />
            </div>
          )}
          </div>
              
            )}
        </div>
      )}
    </>
  );
}

export default YouMayLike;
