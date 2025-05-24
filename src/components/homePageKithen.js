import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios";
import './itemPage.css';
import useScreenSize from "./useIsMobile";

function ItemHomePage() {
  const [items, setItems] = useState([]);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [reviews, setReviews] = useState({}); // Store reviews data
             const {isMobile, isDesktop, isTablet, isSmallMobile, isVerySmall, isVeryVerySmall} = useScreenSize()
   const navigate = useNavigate();

  console.log('video', activeVideoId)

  const fetchCryptoPrices = async (symbols) => {
    try {
      const response = await axios.get("https://api.malidag.com/crypto-prices");
      console.log("Response data:", response.data);
  
      // Filter the response data based on the provided symbols
      const prices = symbols.reduce((acc, symbol) => {
        if (response.data[symbol]) {
          acc[symbol] = parseFloat(response.data[symbol]); // Parse the price to a float
        }
        return acc;
      }, {});
  
      setCryptoPrices(prices);
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`https://api.malidag.com/items/`);
        const fetchedItems = response.data.items || [];
        
        // Filter items by category: "clothes" and "shoes"
        const filteredItems = fetchedItems.filter(
          (item) => item.item.genre === "home"
        );
        
        setItems(filteredItems);
  
        const uniqueCategories = [...new Set(filteredItems.map(item => item.category))];
        setCategories(uniqueCategories);
  
        const cryptoSymbols = [
          ...new Set(filteredItems.map((item) => `${item.item.cryptocurrency}`)),
        ];
        await fetchCryptoPrices(cryptoSymbols);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchItems();
  }, );
  

  const toggleDropdown = (category) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (loading) return <div className="loading-message">Loading...</div>;

  if (!items || items.length === 0) {
    return (
      <div className="no-results-message">
        No results found for "{searchTerm}".
      </div>
    );
  }

  const categorizedItems = categories.reduce((acc, category) => {
    acc[category] = items.filter((item) => item.category === category);
    return acc;
  }, {});

  const getHotItems = (categoryItems) => {
    return [...categoryItems]
      .sort((a, b) => b.item.sold - a.item.sold)
      .slice(0, 4); // Top 3 sold items
  };


  const handleVideoPlay = (id, videoUrl) => {
    console.log('Playing video:', videoUrl); // Debugging line
    setActiveVideoId(id);
  };
  
  const handleVideoStop = () => {
    setActiveVideoId(null);
  };

  if (loading) return <div className="loading-message">Loading...</div>;

  if (!items || items.length === 0) {
    return <div className="no-results-message">No results found for "{searchTerm}".</div>;
  }

   // Handle item click to navigate to product details page
   const handleItemClick = (id) => {
    if (id) {
      navigate(`/product/${id}`); // Navigate to the product details page
    }
  };

  return (
    <>

    <div style={{width: "100%", height: "auto", maxWidth: "100%", overflow: "hidden"}}>
      <img src="https://firebasestorage.googleapis.com/v0/b/benege-93e7c.appspot.com/o/uploads%2Fsteptodown.com479163.jpg?alt=media&token=0abc0129-3e54-4b9c-ba3d-ed4d9e61e960" alt="home and kitchen page" style={{width: "100%", padding: "10px", height: "400px", objectFit: "cover", overflow: "hidden"}} />
    </div>
   
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

      
        {items.map((itemData) => {
          const {itemId, id, item } = itemData;
          const { name, usdPrice, originalPrice, cryptocurrency, sold, videos } = item;
          const cryptoSymbol = `${cryptocurrency}`;
          const crypto = String(cryptocurrency);
          const reviewsData = reviews[itemId] || {}; // Ensure it exists
            const finalRating = reviewsData ? reviewsData.averageRating : "No rating";
          const cryptoPriceInUSD = cryptoPrices[cryptoSymbol] || 0;
          const itemPriceInCrypto =
            cryptoPriceInUSD > 0 ? (usdPrice / cryptoPriceInUSD).toFixed(6) : "N/A";

            const normalizedVideos = Array.isArray(videos) ? videos : [videos];
            const firstVideoUrl = normalizedVideos.find(
              (video) => typeof video === "string" && video.endsWith(".mp4")
            );

          return (
            <div key={id} >
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
                {activeVideoId === id && firstVideoUrl  ? (
                  <video
                    src={firstVideoUrl}
                    controls
                    autoPlay
                    onEnded={handleVideoStop}
                    style={{ width: "100%",
                      height: (isVerySmall) ? "230px" :  "300px",
                      objectFit: "contain" }}
                  />
                ) : (
                  <>
                    <img
                      className="item-image"
                      src={item.images[0]}
                      onClick={() => handleItemClick(id)} // Attach the click handle
                      alt={name}
                       style={{ width: "100%",
                        height:(isVerySmall) ? "230px" :  "300px",
                        objectFit: "contain"}}
                    />
                     {firstVideoUrl && ( 
                      <div
                        className="play-button"
                        onClick={() => handleVideoPlay(id)}
                        style={{
                          position: 'absolute',
                          left: '20px',
                          bottom: '0px',
                          zIndex: '2',
                          transform: 'translate(-50%, -50%)',
                          fontSize: '1.5rem',
                          color: 'white',
                          textShadow: '0 0 5px rgba(0,0,0,0.5)',
                          cursor: 'pointer',
                        }}
                      >
                        ▶️
                      </div>
                    )}
                  </>
                )}
              </div>
              <div  onClick={() => handleItemClick(id)}  className="item-details">
                <div className="item-name" title={name}>
                  {name.length > 20 ? `${name.substring(0, 20)}...` : name}
                </div>
                <div className="item-prices">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="item-price">${usdPrice}</span>
                    {originalPrice > 0 && (
                      <span className="item-original-price">${originalPrice}</span>
                    )}
                    <span
                      className="item-sold"
                      style={{ display: "flex", marginLeft: "10px", fontSize: "0.8rem" }}
                    >
                      {sold}{" "}
                      <div style={{ marginLeft: "5px", fontWeight: "bold", color: "red" }}>
                        sold
                      </div>
                    </span>
                  </div>
                  <div className="item-crypto">
                    <img
                      src={`https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/svg/color/${crypto.toLowerCase()}.svg`}
                      alt={cryptocurrency}
                      className="crypto-icon"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://cryptologos.cc/logos/binance-usd-busd-logo.png";
                      }}
                    />
                    <span className="item-crypto-price">
                      {itemPriceInCrypto !== "N/A"
                        ? `${itemPriceInCrypto} ${cryptocurrency}`
                        : "Price unavailable"}
                    </span>
                  </div>
                </div>
                 <div className="item-type-stars" onClick={() =>
   navigate('/reviewPage', { 
    state: { itemData: itemData}
 }) } title="View reviews of this item">
                {finalRating ? "★".repeat(Math.round(finalRating)) + "☆".repeat(5 - Math.round(finalRating)) : "No rating"}
                </div>
              </div>
            </div>
          );
        })}
     
    </div>
    </>
    
  );
}

export default ItemHomePage;
