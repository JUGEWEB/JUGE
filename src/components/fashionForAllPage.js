import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios";
import './itemPage.css';

function ItemFashionPage() {
  const [items, setItems] = useState([]);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [activeVideoId, setActiveVideoId] = useState(null);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  console.log('video', activeVideoId)

  const fetchCryptoPrices = async (symbols) => {
    try {
      const response = await axios.get("http://192.168.0.210:2000/crypto-prices");
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
        const response = await axios.get(`http://192.168.0.210:3001/items/`);
        const fetchedItems = response.data.items || [];
        
        // Filter items by category: "clothes" and "shoes"
        const filteredItems = fetchedItems.filter(
          (item) => item.category === "clothes" || item.category === "Shoes" || item.category === "Clothes"
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
    <div className="item-page-title">
        <div>Fashion for all.</div>
        <div style={{ marginLeft: "20px" }}>Related Categories:</div>
        <div className="related-info">
          <div className="related-categories">
            {categories.map((category, index) => (
              <div key={index}>
                <div
                  className="related-category"
                  onClick={() => toggleDropdown(category)}
                >
                  {category}
                <span
                className={`dropdown-arrow ${
                dropdownOpen[category] ? "arrow-open" : "arrow-closed"
                }`}
            >
                ▼
            </span>
                </div>
               
                {dropdownOpen[category] && (
                  <div className="stable-category-dropdown">
                    <div className="stable-category-types">
                      <strong>malidag {category}</strong>
                      {categorizedItems[category]
                        .map((item) => item.item.type)
                        .filter((type, idx, arr) => arr.indexOf(type) === idx)
                        .map((type, idx) => (
                          <div key={idx} className="stable-type-item">
                            {type}
                          </div>
                        ))}
                    </div>
                    <div>
                    <strong style={{marginLeft: '50%'}}>Hot 🔥:</strong>
                    <div className="stable-hot-items">
                      {getHotItems(categorizedItems[category]).map(
                        (hotItem, idx) => (
                          <div key={idx} className="stable-hot-item">
                            <img
                              src={hotItem.item.images[0]}
                              alt={hotItem.item.name}
                              onClick={() => handleItemClick(hotItem.id)} // Attach the click handle
                              className="stable-hot-item-image"
                            />
                            <div  onClick={() => handleItemClick(hotItem.id)}  className="stable-hot-item-name">
                              {hotItem.item.name}
                            </div>
                            <div className="stable-hot-item-sold">
                              {hotItem.item.sold} sold
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    <div className="item-page-container">
      <div className="search-results-container">
        {items.map((itemData) => {
          const { id, item } = itemData;
          const { name, usdPrice, originalPrice, cryptocurrency, sold, videos } = item;
          const cryptoSymbol = `${cryptocurrency}`;
          const crypto = String(cryptocurrency);
          const stars = Math.floor(Math.random() * 5) + 1; // Random stars for now
          const cryptoPriceInUSD = cryptoPrices[cryptoSymbol] || 0;
          const itemPriceInCrypto =
            cryptoPriceInUSD > 0 ? (usdPrice / cryptoPriceInUSD).toFixed(6) : "N/A";

            const normalizedVideos = Array.isArray(videos) ? videos : [videos];
            const firstVideoUrl = normalizedVideos.find(
              (video) => typeof video === "string" && video.endsWith(".mp4")
            );

          return (
            <div key={id} className="item-card">
              <div
                style={{
                  background: 'white',
                  zIndex: '1',
                  filter: "brightness(0.93)",
                  width: '230px',
                  height: '230px',
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
                    style={{ width: '230px', height: '230px', objectFit: 'cover' }}
                  />
                ) : (
                  <>
                    <img
                      className="item-image"
                      src={item.images[0]}
                      alt={name}
                      onClick={() => handleItemClick(id)} // Attach the click handle
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
              <div  onClick={() => handleItemClick(id)} className="item-details">
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
                <div className="item-stars">
                  {"★".repeat(stars)}{"☆".repeat(5 - stars)}
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

export default ItemFashionPage;
