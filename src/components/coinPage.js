import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import useScreenSize from "./useIsMobile";
import Coin from "./coin";
import "./coinPage.css"

function CoinPage() {
    const { crypto } = useParams(); // Extract cryptocurrency from URL
  const [items, setItems] = useState([]);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [chartVisible, setChartVisible] = useState(false); // State for chart visibility
  const navigate = useNavigate(); // Initialize the useNavigate hook
   const [reviews, setReviews] = useState({}); // Store reviews data
  const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall, isVeryVerySmall} = useScreenSize()
  

  const fetchCryptoPrices = async (symbols) => {
    try {
      const response = await axios.get("https://api.malidag.com/crypto-prices");
  
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

   // Fetch reviews from the endpoint
   const fetchReviews = async (productId) => {
    try {
      const response = await axios.get(`http://192.168.0.210:6001/get-reviews/${productId}`);
      if (response.data.success) {
       
        const reviewsArray = response.data.reviews || [];
        const totalRating = reviewsArray.reduce((acc, review) => {
          let rating = parseFloat(review.rating);
          return acc + (isNaN(rating) ? 4 : rating); // If rating is invalid, treat as 5 stars
        }, 0);
        const averageRating = reviewsArray.length ? (totalRating / reviewsArray.length).toFixed(2) : null;

        setReviews((prevReviews) => ({
          ...prevReviews,
          [productId]: { averageRating, reviewsArray },
        }));

      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  

  useEffect(() => {
    const fetchItemsByCrypto = async () => {
      try {
        //https://api.malidag.com/items
        const response = await axios.get(`https://api.malidag.com/items/crypto/${crypto}`);
        const fetchedItems = response.data.items || [];
        setItems(fetchedItems);

        const uniqueCategories = [...new Set(fetchedItems.map(item => item.category))];
        setCategories(uniqueCategories);

         // Fetch reviews for each item
       uniqueCategories.forEach((item) => {
        fetchReviews(item.itemId); // Fetch reviews for each product
      });
       
        const cryptoSymbols = [
          ...new Set(fetchedItems.map((item) => `${item.item.cryptocurrency}`)),
        ];
        await fetchCryptoPrices(cryptoSymbols);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    
    

    fetchItemsByCrypto();
  }, [crypto]); // Run when the crypto parameter changes

  const toggleDropdown = (category) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleChartVisibility = () => {
    setChartVisible((prev) => !prev); // Toggle chart visibility
  };

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
    setActiveVideoId(id);
  };
  
  const handleVideoStop = () => {
    setActiveVideoId(null);
  };

  if (loading) {
    return (
      <div
        className="loading-message"
        style={{
          width: "100%",
          height: "500px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.2rem",
          color: "#555",
          backgroundColor: "white",
        }}
      >
    
      </div>
    );
  }
  
  if (!items || items.length === 0) {
    return (
      <div
        className="no-results-message"
        style={{
          width: "100%",
          height: "500px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.1rem",
          fontWeight: "500",
          color: "#777",
          backgroundColor: "#fff3f3",
          border: "1px solid #ffdddd",
          borderRadius: "8px",
        }}
      >
         No results found for "{crypto}". 😔
      </div>
    );
  }

  // Handle item click to navigate to product details page
  const handleItemClick = (id) => {
    if (id) {
      navigate(`/product/${id}`); // Navigate to the product details page
    }
  };

  return (
    <>
    <div style={{position: "relative", width: "100%"}}>
    <div style={{color: "#222", display: "flex", alignItems: "center", justifyContent: "start", overflowX: "auto", width: "100%", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)"}}>
        <div style={{marginLeft: "10px"}}>Malidag crypto "{crypto}".</div>
        <div style={{ marginLeft: "20px" }}>Related Categories:</div>
     

      {/* CATEGORY HEADERS */}
     
        <div style={{display: "flex", alignItems: "center", marginLeft: "10px", marginRight: "10px", justifyContent: "start"}} >
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => toggleDropdown(category)}
              style={{display: "flex", alignItems: "center", justifyContent: "start", padding: "10px", cursor: "pointer"}}
            >
              <div>
              {category}
              </div>
              <span
                className={`dropdown-arrow ${
                  dropdownOpen[category] ? "arrow-open" : "arrow-closed"
                }`}
              >
                ▼
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORY DROPDOWNS (Below headers) */}
      <div className="dropdown-seitction" style={{
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        position: "absolute",
        zIndex: 1000,
        backgroundColor: "white",
        width: "100%"

      }}>
        {categories.map((category) =>
          dropdownOpen[category] ? (
            <div key={category}style={{
              display: "flex",
              alignItems: "center"
            }}>
              <div style={{color: "#222", marginLeft: "10px"}}>
                <strong>malidag {category}</strong>
                {categorizedItems[category]
                  .map((item) => item.item.type)
                  .filter((type, idx, arr) => arr.indexOf(type) === idx)
                  .map((type, idx) => (
                    <div key={idx} className="stale-ty-item" style={{color: "blue", padding: "10px", textDecoration: "underline", cursor: "pointer"}}>
                      {type}
                    </div>
                  ))}
              </div>
              <div style={{width: "100%", maxWidth: "100%", overflowX: "auto", marginTop: "10px"}}>
                <strong style={{ marginLeft: "50%", color: "#222" }}>Hot 🔥:</strong>
                <div className="stable-hot-items">
                  {getHotItems(categorizedItems[category]).map((hotItem, idx) => (
                    <div key={idx} className="stable-hot-item">
                      <img
                        src={hotItem.item.images[0]}
                        alt={hotItem.item.name}
                        onClick={() => handleItemClick(hotItem.id)}
                        className="stable-hot-item-image"
                      />
                      <div
                        onClick={() => handleItemClick(hotItem.id)}
                        className="stable-hot-item-name"
                      >
                        {hotItem.item.name}
                      </div>
                      <div className="stable-hot-item-sold">{hotItem.item.sold} sold</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>
      </div>

      <div>
      <div style={{display: 'flex', margin: '20px', border: '1px solid black', padding: '10px'}}>
      <div style={{color: 'black', marginLeft: '20px', fontSize: '11px', fontWeight: 'bold'}}>View {crypto} chart here <a style={{color: 'green', cursor: 'pointer'}} onClick={toggleChartVisibility} > {chartVisible ? "▲ Hide" : "▼ Show"}</a></div>
      <div  style={{color: 'black', marginLeft: '20px', fontSize: '11px', fontWeight: 'bold'}}>want to know more about {crypto} / buy {crypto} (100% secure) go to <a style={{color: 'green', cursor: 'pointer'}}>binege</a></div>
      </div>
       {/* Conditionally Render the Chart */}
       {chartVisible && (
      <div className="tradingview-widget-container" style={{top: '10px'}}>
            <iframe
              src={`https://s.tradingview.com/widgetembed/?symbol=BINANCE:${crypto.toUpperCase()}USDT&interval=60&theme=light&style=1&hide_top_toolbar=true&hide_side_toolbar=true&hide_legend=true&withdateranges=false&hide_volume=true`}
              title={`${crypto} Chart`}
              style={{
                width: '90%',
                height: '400px',
                border: 'none',
                borderRadius: '8px',
                marginLeft: '50px',
                marginRight: '50px'
              }}
              allowFullScreen
            ></iframe>
          </div>
           )}
      </div>
    
     
    <div className="item-coin-container">
      <div className="search-results-coin-container" style={{
  display: "grid",
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
      ? "repeat(4, 1fr)"
      : "repeat(5, 1fr)",
}}>
        {items.map((itemData) => {
          const { id, item } = itemData;
          const itemId = item.itemId;
          const { name, usdPrice, originalPrice, cryptocurrency, sold, videos } = item;
          const cryptoSymbol = `${cryptocurrency}`;
          const crypto = String(cryptocurrency);
         
          const cryptoPriceInUSD = cryptoPrices[cryptoSymbol] || 0;
          const itemPriceInCrypto =
            cryptoPriceInUSD > 0 ? (usdPrice / cryptoPriceInUSD).toFixed(6) : "N/A";

            const reviewsData = reviews[itemId] || {}; // Ensure it exists
            const finalRating = reviewsData ? reviewsData.averageRating : "No rating";
            const normalizedVideos = Array.isArray(videos) ? videos : [videos];
          const firstVideoUrl = normalizedVideos.find(
            (video) => typeof video === "string" && video.endsWith(".mp4")
          );

          return (
            <div key={id} className="item-coin-card" style={{width :"100%", maxWidth: "100%"}}>
              <div
                  style={{
                    background: "white",
                    zIndex: "1",
                    filter: "brightness(0.880000000) contrast(1.2)",
                    width: "100%",
                    height:(isVerySmall) ? "230px" :  "250px",
                    marginBottom: "10px",
                    marginTop: "10px",
                    position: "relative",
                }}
              >
                {activeVideoId === id && firstVideoUrl  ? (
                  <video
                    src={firstVideoUrl}
                    controls
                    autoPlay
                    onEnded={handleVideoStop}
                    style={{ width: "100%",
                      height: (isVerySmall) ? "230px" :  "250px",
                      objectFit: "contain" }}
                  />
                ) : (
                  <>
                    <img
                      src={item.images[0]}
                      onClick={() => handleItemClick(id)} // Attach the click handle
                      alt={name}
                      style={{ width: "100%",
                        height:(isVerySmall) ? "230px" :  "250px",
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
              <div   className="item-details">
                <div className="item-name" title={name}>
                  {name.length > 20 ? `${name.substring(0, 20)}...` : name}
                </div>
                <div className="item-prices">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "start" }}>
                    <span className="item-price">${usdPrice}</span>
                    {originalPrice > 0 && (
                      <span className="item-original-price" style={{color: "black"}}>${originalPrice}</span>
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
                  <div className="item-crypto" style={{display: "flex", justifyContent: "start", alignItems: "center"}}>
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
                <div className="item-stars"  onClick={() =>
   navigate('/reviewPage', { 
    state: { itemData: itemData}
 }) } title="View reviews of this item" >
                 {finalRating ? "★".repeat(Math.round(finalRating)) + "☆".repeat(5 - Math.round(finalRating)) : "No rating"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
    
  );
}

export default CoinPage;