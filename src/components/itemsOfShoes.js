import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './itemOfShoes.css';

function ItemOfShoes() {
  const { itemClicked } = useParams();
  const [items, setItems] = useState([]);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [beautyImages, setBeautyImages] = useState([]); // Store beauty images
  const [selectedSize, setSelectedSize] = useState(null); // Track selected size
   // Extract gender and type from itemClicked (e.g., "men-sneakers")
   const [gender, type] = itemClicked.split("-");
  const navigate = useNavigate();

  console.log('video', activeVideoId)
  console.log('itemClick', itemClicked)

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
    const fetchBeautyImages = async () => {
      try {
        const response = await axios.get("http://192.168.0.210:7002/shoes/images");

        // ✅ Filter images where type matches itemClicked
        const filteredImages = response.data.filter(
          (image) => image.type.toLowerCase() === itemClicked.toLowerCase()
        );
          console.log("filtered", filteredImages)
        setBeautyImages(filteredImages);
      } catch (error) {
        console.error("Error fetching beauty images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeautyImages();
  }, [itemClicked]); // ✅ Re-fetch when `itemClicked` changes

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [, type] = itemClicked.split("-");
        console.log("type:", type)
        const response = await axios.get(`https://api.malidag.com/items/${type}`);
        const fetchedItems = response.data.items || [];

        const [gender] = itemClicked.split("-");
       // Ensure case-insensitive filtering
      const filteredItems = fetchedItems.filter(
        (item) => item.item.genre.toLowerCase() === gender.toLowerCase()
      );
        
        setItems(filteredItems);
        const uniqueCategories = [...new Set(filteredItems.map(item => item.category))];
        setCategories(uniqueCategories);

        const cryptoSymbols = [...new Set(filteredItems.map((item) => `${item.item.cryptocurrency}`))];
        await fetchCryptoPrices(cryptoSymbols);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [itemClicked]);

  // Extracts and splits size values
  const getAllSizes = (items) => {
    const allSizes = items.map((item) => {
      const sizes = Object.values(item.item.size || {});
      // Flatten the array of sizes, then split by commas to get individual sizes
      return sizes.flat().map((size) => size.split(",").map((s) => s.trim())).flat();
    });
    return [...new Set(allSizes.flat())]; // Flatten and remove duplicates
  };

  // Filter items based on the selected size
  const filterItemsBySize = (size) => {
    return items.filter((item) => {
      const availableSizes = Object.values(item.item.size || {}).flat();
      // Check if the size is included in any of the available size strings
      return availableSizes.some((s) => s.split(",").map((s) => s.trim()).includes(size));
    });
  };

  const toggleDropdown = (category) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (loading) return <div className="loading-message">Loading...</div>;

 

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

  const handleNavigate = (id) => {
    navigate(`/product/${id}`);
  };

   // Apply size filter if selectedSize is set
   const displayedItems = selectedSize ? filterItemsBySize(selectedSize) : items;

  return (
    <>
    <div className="item-pge-tile">
        <div>Malidag {itemClicked}.</div>
        <div style={{ marginLeft: "20px" }}>Related Categories:</div>
        <div className="related-ifo">
          <div className="related-catgories">
            {categories.map((category, index) => (
              <div key={index}>
                <div
                  className="related-catgory"
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
                  <div className="stable-catgory-dropdown">
                    <div className="stable-catgory-types">
                      <strong>malidag {category}</strong>
                      {categorizedItems[category]
                        .map((item) => item.item.type)
                        .filter((type, idx, arr) => arr.indexOf(type) === idx)
                        .map((type, idx) => (
                          <div key={idx} className="stable-tpe-item">
                            {type}
                          </div>
                        ))}
                    </div>
                    <div>
                    <strong style={{marginLeft: '50%'}}>Hot 🔥:</strong>
                    <div className="stable-ht-items">
                      {getHotItems(categorizedItems[category]).map(
                        (hotItem, idx) => (
                          <div key={idx} className="stable-ht-item">
                            <img
                              src={hotItem.item.images[0]}
                              alt={hotItem.item.name}
                               onClick={() => handleNavigate(hotItem.id)} // Navigate when clicking the card
                              className="stable-ht-item-image"
                            />
                            <div className="stable-ht-item-name">
                              {hotItem.item.name}
                            </div>
                            <div className="stable-ht-item-sold">
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
      {loading ? (
        <p>Loading images...</p>
      ) : (
        <div className="beauty-images-container" 
        style={{
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
        >
          {beautyImages.length > 0 ? (
            beautyImages.map((img, index) => (
              <img
                key={index}
                src={img.imageUrl} // ✅ Corrected URL
                alt={itemClicked}
                className="beauty-image"
                style={{maxHeight: "400px", width: "1200px", objectFit: "cover"}}
              />
            ))
          ) : (
            <p ></p>
          )}
        </div>
      )}
    <div className="item-pge-container">
   
 
  <div className="size-filter-container">
            <h3>Filter by Size</h3>
            <div className="sizes-list">
              {getAllSizes(items).map((size) => (
                <button
                  key={size}
                  className={`size-button ${selectedSize === size ? "active" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            {selectedSize && (
              <button className="clear-filter" onClick={() => setSelectedSize(null)}>
                ❌ Clear Filter
              </button>
            )}
          
</div>


      <div className="search-reslts-container">
        {displayedItems.map((itemData) => {
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
            <div key={id} className="itm-card">
              <div
                style={{
                  background: '#dddddd53',
                  zIndex: '1',
                 paddingTop: "20px",
                  width: '290px',
                  height: '300px',
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
                    style={{ width: '290px', height: '300px', objectFit: 'cover' }}
                  />
                ) : (
                  <>
                    <img
                      className="item-imageofshoes"
                      src={item.images[0]}
                      alt={name}
                      onClick={() => handleNavigate(id)} // Navigate when clicking the card
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
              <div className="item-details"  onClick={() => handleNavigate(id)} >
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

export default ItemOfShoes;
