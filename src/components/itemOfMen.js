import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useScreenSize from "./useIsMobile";
import './itemOfWomen.css';

function ItemOfMen() {
  const { itemClicked } = useParams();
  const [items, setItems] = useState([]);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [beautyImages, setBeautyImages] = useState([]); // Store beauty images
  const [selectedSize, setSelectedSize] = useState(null); // Track selected size
   const [reviews, setReviews] = useState({}); // Store reviews data
        const {isMobile, isDesktop, isTablet, isSmallMobile, isVerySmall, isVeryVerySmall} = useScreenSize()
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
        const response = await axios.get("https://api.malidag.com/men/images");

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

  // Fetch reviews from the endpoint
            const fetchReviews = async (productId) => {
              try {
                const response = await axios.get(`https://api.malidag.com/get-reviews/${productId}`);
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
    const fetchItems = async () => {
      try {
        const response = await axios.get(`https://api.malidag.com/items/${itemClicked}`);
        const fetchedItems = response.data.items || [];
        const filteredItems = fetchedItems.filter(item => item.item.genre === "men");
       setItems(filteredItems)

        const uniqueCategories = [...new Set(fetchedItems.map(item => item.category))];
        setCategories(uniqueCategories);

          // Fetch reviews for each item
       filteredItems.forEach((item) => {
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
    <div style={{maxWidth: "100%", overflow: "hidden"}} >
   <div  style={{maxWidth: "100%", width: "100%", color: "black"}}>
      <div style={{width: "100%", overflowX: "auto"}}>
      <div style={{width: "100%", maxWidth: "100%", display: "flex", alignItems: "center", justifyContent: "start", padding: "10px"}}>
        <div>Malidag {itemClicked}</div>
        <div style={{ marginLeft: "20px" }}>Related Categories:</div>
           <div style={{ marginLeft: "20px" }}>
        {categories.map((category, index) => (
  <div key={index}>
    <div
      onClick={() => toggleDropdown(category)}
    >
      {category}
      <span className={`dropdown-arrow ${dropdownOpen[category] ? "arrow-open" : "arrow-closed"}`}>
        ▼
      </span>
    </div>
  </div>
))}
</div>
</div>
</div>
        <div>

          <div style={{position: "relative", width: "100%"}}>

{/* Render dropdown separately so you can move it wherever you want */}
<div style={{position: "absolute", width: "100%", zIndex: "1000", backgroundColor: "white"}}>
{categories.map((category) =>
  dropdownOpen[category] ? (
    <div key={category}  style={{position: "relative", width: "100%", display: "flex", alignItems: "center"}}>
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
        <strong style={{ marginLeft: "50%" , width: "100%"}}>Hot 🔥:</strong>
        <div style={{width: "100%", backgroundColor: "white"}}>
          {getHotItems(categorizedItems[category]).map((hotItem, idx) => (
            <div key={idx} style={{width: "250px"}}>
              <img
                src={hotItem.item.images[0]}
                alt={hotItem.item.name}
                onClick={() => handleNavigate(hotItem.id)}
                className="stable-ht-item-image"
              />
              <div className="stable-ht-item-name">{hotItem.item.name}</div>
              <div className="stable-ht-item-sold">{hotItem.item.sold} sold</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : null
)}
</div>

          </div>
        </div>
      </div>
      {loading ? (
        <p>Loading images...</p>
      ) : (
        <div className="beauty-images-container" 
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", maxWidth: "100%"
        }}
        >
          {beautyImages.length > 0 ? (
            beautyImages.map((img, index) => (
              <img
                key={index}
                src={img.imageUrl} // ✅ Corrected URL
                alt={itemClicked}
                className="beauty-image"
                style={{maxHeight: "400px", width: "100%", objectFit: "cover", padding: "20px"}}
              />
            ))
          ) : (
            <p ></p>
          )}
        </div>
      )}

       <div style={{
       display: (isDesktop) ? "none" : "",
  backgroundColor: '#f8f9fa', 
  borderLeft: '5px solid #4CAF50', 
  padding: '15px', 
  borderRadius: '8px', 
  fontFamily: 'Arial, sans-serif', 
  lineHeight: '1.5', 
  color: '#333',
  margin: '20px 0',
   maxHeight: "auto",
  maxWidth: "100%"
}}>
  <h2 style={{ color: '#4CAF50', marginBottom: '10px' }}>🔍 Search by Size 👕</h2>
  <p>Finding the perfect fit is easier than ever! Use our size search feature to explore clothing in your preferred size:</p>
  <ul style={{ paddingLeft: '20px' }}>
    <li>✅ <strong>Small (S)</strong> – For a snug and comfortable fit.</li>
    <li>✅ <strong>Medium (M)</strong> – Classic and standard sizing.</li>
    <li>✅ <strong>Large (L)</strong> – Roomy and relaxed wear.</li>
    <li>✅ <strong>Extra Large (XL, XXL, XXXL)</strong> – Designed for ultimate comfort.</li>
  </ul>
  <p style={{ fontWeight: 'bold', color: '#4CAF50' }}>Find your size effortlessly and shop with confidence! 👗🛍️</p>

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
</div>


    <div style={{display: "flex"}} >
    <div style={{
       display: (!isDesktop) ? "none" : "",
  backgroundColor: '#f8f9fa', 
  borderLeft: '5px solid #4CAF50', 
  padding: '15px', 
  borderRadius: '8px', 
  fontFamily: 'Arial, sans-serif', 
  lineHeight: '1.5', 
  color: '#333',
  margin: '20px 0',
   maxHeight: "auto",
  maxWidth: "210px"
}}>
  <h2 style={{ color: '#4CAF50', marginBottom: '10px' }}>🔍 Search by Size 👕</h2>
  <p>Finding the perfect fit is easier than ever! Use our size search feature to explore clothing in your preferred size:</p>
  <ul style={{ paddingLeft: '20px' }}>
    <li>✅ <strong>Small (S)</strong> – For a snug and comfortable fit.</li>
    <li>✅ <strong>Medium (M)</strong> – Classic and standard sizing.</li>
    <li>✅ <strong>Large (L)</strong> – Roomy and relaxed wear.</li>
    <li>✅ <strong>Extra Large (XL, XXL, XXXL)</strong> – Designed for ultimate comfort.</li>
  </ul>
  <p style={{ fontWeight: 'bold', color: '#4CAF50' }}>Find your size effortlessly and shop with confidence! 👗🛍️</p>

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
</div>


      <div  style={{
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
      : "repeat(3, 1fr)",
}}>
        {displayedItems.map((itemData) => {
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
            <div key={id} style={{width :"100%", maxWidth: "100%", margin: " 0 auto"}} >
              <div
                 style={{
                  background: '#dddddd53',
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
                      className="item-imageof"
                      src={item.images[0]}
                      alt={name}
                      onClick={() => handleNavigate(id)} // Navigate when clicking the card
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
    </div>
    </div>
    
  );
}

export default ItemOfMen;
